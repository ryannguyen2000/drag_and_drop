import {
  DragStartEvent,
  DragEndEvent,
  DndContext,
  pointerWithin,
  DragOverlay,
  useSensors,
  PointerSensor,
  useSensor,
} from "@dnd-kit/core";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import Sidebar from "../../components/sidebar";
import TrashBin from "../../components/trashBin";
import { RootState } from "../../store";
import {
  Obj,
  setActiveId,
  setData,
  setDataFetchData,
  setSidebar,
} from "../../store/DndSlice";
import PropertiesBar from "../../components/propertiesbar";
import { GetData } from "../../apis";
import { DecryptBasic } from "../../utilities/hash_aes";
import { GetACookie } from "../../utilities/cookies";
import { Enum } from "../../config/common";
import { setDocumentName } from "../../store/documents/documentSlice";
import { findObjectById, FindToAdd } from "./const";
import RenderMonacoEditor from "./renderMonacoEditor";
import RenderToolbarMonaco from "./renderToolbarMonaco";
import FrameEditor from "./frameEditor";

const Editor = () => {
  const {
    activeId,
    data,
    sidebar,
    deepLevel,
    activeCreateFunction,
    typeScreen,
    moveSliceParent,
  } = useSelector((state: RootState) => state.dndSlice);

  const [scale, setScale] = useState(1);

  const dataLayout = data[typeScreen];

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      const response = (await GetData(
        `${import.meta.env.VITE__API_HOST}/api/documents?dId=${DecryptBasic(
          GetACookie("did"),
          Enum.srkey
        )}`
      )) as any;
      if (response && response?.layoutJson) {
        dispatch(setDocumentName(response?.documentName));
        const newLayout = response?.layoutJson;
        dispatch(setDataFetchData(newLayout));
        return;
      }
      dispatch(
        setData({
          id: "root",
          thumnail: "_",
          type: "grid",
          columns: "1",
          gap: "1",
          rows: "1",
          colspan: "1",
          rowspan: "1",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          style: {},
          childs: [],
          dataSlice: {},
        })
      );
      return;
    };

    fetchData();
  }, []);

  const isParentOf = (activeId: string, objOver: any) => {
    let isParent = false;
    if (!_.isEmpty(objOver)) {
      isParent = Boolean(_.find(objOver.childs, { id: activeId }));
    }
    return isParent;
  };

  const hideBin = () => {
    const bin = document.getElementById("bin_id");
    if (!bin) return;
    bin.style.display = "none";
  };
  const showBin = () => {
    const bin = document.getElementById("bin_id");
    if (!bin) return;
    bin.style.display = "flex";
  };

  const handleDragStart = (event: DragStartEvent) => {
    showBin();
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    hideBin();
    if (over?.id === "trash-bin") {
      const newData = JSON.parse(JSON.stringify(dataLayout));
      const removeItemFromLayout = (nodes: Obj[]): Obj[] => {
        return nodes
          .filter((node) => node.id !== active.id)
          .map((node) => ({
            ...node,
            childs: removeItemFromLayout(node.childs),
          }));
      };

      const collectAllChildren = (nodes: Obj[]): Obj[] => {
        return nodes.flatMap((node) => [
          node,
          ...collectAllChildren(node.childs),
        ]);
      };

      const findNodeAndCollectChildren = (
        nodes: Obj[],
        nodeId: string
      ): Obj[] | null => {
        for (const node of nodes) {
          if (node.id === nodeId) {
            if (node.childs.length === 0) {
              return [node];
            }
            return collectAllChildren(node.childs);
          } else if (node.childs.length > 0) {
            const result = findNodeAndCollectChildren(node.childs, nodeId);
            if (result) return result;
          }
        }
        return null;
      };

      const removedChildren = findNodeAndCollectChildren(
        [newData],
        String(active.id)
      );
      console.log("🚀 ~ handleDragEnd ~ removedChildren:", removedChildren);

      newData.childs = removeItemFromLayout(newData.childs);
      let updatedSidebar = [...sidebar];

      if (removedChildren) {
        const newChildren = removedChildren
          .map((child) => {
            if (child.type !== "grid" && child.type !== "flex") {
              return {
                ...child,
                dataSlice: {},
                columns: "1",
                rows: "1",
                colspan: "1",
                rowspan: "1",
                alignItems: "flex-start",
                justifyContent: "flex-start",
                gap: "1",
                thumbnail: child.thumbnail || "",
              };
            }
            return null;
          })
          .filter(Boolean);

        newChildren.forEach((newChild) => {
          if (
            !updatedSidebar.some(
              (existingItem) => existingItem.id === newChild.id
            )
          ) {
            updatedSidebar.push(newChild);
          }
        });
      }

      dispatch(setSidebar(updatedSidebar));
      dispatch(setData(newData));

      return;
    }

    dispatch(setActiveId(active.id));

    if (over && active.id !== over.id) {
      if (deepLevel <= 6) {
        const updatedSidebar = sidebar.filter((sb) => sb.id !== active.id);
        dispatch(setSidebar(updatedSidebar));
      }
    }
  };

  const handleDragOver = (event: any) => {
    const { active, over } = event;
    if (!over || !active || over?.id === "trash-bin") return;

    const id = active.id.toString();
    const over_id = over.id.toString();

    const objOver = findObjectById(dataLayout, over_id);
    const overIsParentActive = isParentOf(id, objOver);

    const isItself = active.id === over.id;

    if (objOver?.type === "content") {
      console.log("🛑 Hover vào content:", { over, active });
    }

    if (active.id !== over.id && !overIsParentActive && !isItself) {
      FindToAdd({
        id,
        detail: active.data.current,
        parent_id: over.data.current?.parentId ?? over.id.toString(),
        over_id,
        type: over?.data?.current?.type || "",
        dataLayout,
        dispatch,
        moveSliceParent,
      });
    }
  };

  const renderBin = (
    <div
      id="bin_id"
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 mb-[6.25rem] hidden justify-center items-center"
      style={{
        zIndex: 9999,
      }}
    >
      <TrashBin />
    </div>
  );

  const renderSidebar = !activeCreateFunction && <Sidebar />;
  const renderPropertiesBar = !activeCreateFunction && <PropertiesBar />;

  useEffect(() => {
    function updateScale() {
      const actualWidth = 1200; // Max-width của UI Builder
      const currentWidth = window.innerWidth; // Kích thước màn hình hiện tại
      setScale(currentWidth / actualWidth);
    }

    updateScale(); // Cập nhật ngay khi mở trang
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  return (
    <>
      <DndContext
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        sensors={useSensors(useSensor(PointerSensor))}
      >
        <RenderToolbarMonaco hidden={!activeCreateFunction} />

        <div className="flex items-start w-full relative">
          {renderBin}
          {renderSidebar}
          <FrameEditor
            activeCreateFunction={activeCreateFunction}
            data={data}
            dataLayout={dataLayout}
          />

          <RenderMonacoEditor hidden={!activeCreateFunction} />
          {renderPropertiesBar}
        </div>
        <DragOverlay
          style={{
            zIndex: 999,
            pointerEvents: "none",
            position: "fixed",
            opacity: 0.4,
          }}
        >
          {activeId ? (
            <div
              className="bg-slate-50 opacity-40 w-full h-full rounded-xl"
              style={{ zIndex: 999 }}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </>
  );
};

export default Editor;
