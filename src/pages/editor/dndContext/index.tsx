import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  pointerWithin,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";

import RenderToolbarMonaco from "../components/renderToolbarMonaco";
import FrameEditor from "../components/frameEditor";
import RenderMonacoEditor from "../components/renderMonacoEditor";
import PropertiesBar from "../../../components/propertiesbar";
import TrashBin from "../../../components/trashBin";
import { RootState } from "../../../store";
import { Obj, setActiveId, setData, setSidebar } from "../../../store/DndSlice";
import { findObjectById, FindToAdd } from "../const";
import Sidebar from "../../../components/sidebar";

const DndContentComponent = () => {
  const dispatch = useDispatch();

  const { data, sidebar, activeCreateFunction, typeScreen, moveSliceParent } =
    useSelector((state: RootState) => state.dndSlice);

  const dataLayout = data[typeScreen];

  const isParentOf = (activeId: string, objOver: any) => {
    let isParent = false;
    if (!_.isEmpty(objOver)) {
      isParent = Boolean(_.find(objOver.childs, { id: activeId }));
    }
    return isParent;
  };

  const renderBin = (
    <div
      id="bin_id"
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 mb-[6.25rem]  justify-center items-center"
    >
      <TrashBin />
    </div>
  );

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

    if (!over || !active || over?.id === "trash-bin") return;

    const id = active.id.toString();
    const over_id = over.id.toString();

    const objOver = findObjectById(dataLayout, over_id);
    const overIsParentActive = isParentOf(id, objOver);

    const isItself = active.id === over.id;

    if (objOver?.type === "content") {
      console.log("🛑 Hover vào content:", { over, active });
    }

    console.log("handleDragOver", {
      active,
      over,
    });

    if (
      active.id !== over.id &&
      !overIsParentActive &&
      !isItself &&
      !_.isEmpty(active.data.current)
    ) {
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

  const handleDragOver = (event: any) => {
    const { active, over } = event;
  };

  const renderPropertiesBar = !activeCreateFunction && <PropertiesBar />;
  const renderSidebar = !activeCreateFunction && <Sidebar />;

  return (
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
          opacity: 1,
        }}
      ></DragOverlay>
    </DndContext>
  );
};

export default DndContentComponent;
