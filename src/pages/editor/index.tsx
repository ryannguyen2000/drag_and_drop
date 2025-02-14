import {
  DragStartEvent,
  DragEndEvent,
  DndContext,
  pointerWithin,
  DragOverlay,
  closestCenter,
  closestCorners,
  rectIntersection,
} from "@dnd-kit/core";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";

import Droppable from "../../components/droppable";
import Sidebar from "../../components/sidebar";
import TrashBin from "../../components/trashBin";
import ItemsRenderer from "../../features";
import { RootState } from "../../store";
import {
  Obj,
  setActiveId,
  setData,
  setDataFetchData,
  setScrollLock,
  setSidebar,
} from "../../store/DndSlice";
import PropertiesBar from "../../components/propertiesbar";
import { GetData } from "../../apis";
import { DecryptBasic } from "../../utilities/hash_aes";
import { GetACookie } from "../../utilities/cookies";
import { Enum } from "../../config/common";
import BtnHandleCreateFc from "../../components/propertiesbar/components/btnHandleCreateFc";
import MonacoEditor from "../../components/monacoEditor";
import BtnPublish from "../../components/propertiesbar/components/btnPublish";
import { setDocumentName } from "../../store/documents/documentSlice";

const Editor = () => {
  const {
    activeId,
    data,
    sidebar,
    deepLevel,
    activeCreateFunction,
    typeScreen,
  } = useSelector((state: RootState) => state.dndSlice);

  const [scale, setScale] = useState(1);
  const [allowSwapGridFlex, setAllowSwapGridFlex] = useState(false);

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

  const FindToAdd = ({
    id,
    detail,
    parent_id,
    over_id,
    type,
    liveUpdate = false,
  }) => {
    const newData = JSON.parse(JSON.stringify(dataLayout));
    let layoutChilds = [];
    let activeItemBackup = null; // ✅ Khôi phục biến lưu dữ liệu của `active.id`
    let isNewObject = true;

    const checkIfExists = (nodes) => {
      nodes.forEach((node) => {
        if (node.id === id) isNewObject = false;
        if (node.childs.length > 0) checkIfExists(node.childs);
      });
    };

    checkIfExists([newData]);

    // ✅ Hàm loại bỏ object đang kéo khỏi vị trí cũ (nếu cần)
    const removeChildFromParent = (nodes, parent = null) => {
      nodes.forEach((node) => {
        // ✅ Kiểm tra nếu `over_id` và `activeId` cùng cấp
        let overIndex = _.findIndex(node.childs, { id: over_id });
        let activeIndex = _.findIndex(node.childs, { id: id });

        if (
          parent &&
          overIndex !== -1 &&
          activeIndex !== -1 &&
          type !== "grid" &&
          type !== "flex"
        ) {
          return;
        }
        // ✅ Nếu `activeId` nằm trong `root.childs`, xóa trước
        if (node.id === "root") {
          node.childs = node.childs.filter((child) => {
            if (child.id === id) {
              // console.log("🚨 Removing Object from Root:", child);
              activeItemBackup = JSON.parse(JSON.stringify(child));
              layoutChilds = child.childs;
              return false;
            }
            return true;
          });
        }

        node.childs = node.childs.filter((child) => {
          if (child.id === id) {
            // console.log("🚨 Removing Object Before Replacing:", child);
            activeItemBackup = JSON.parse(JSON.stringify(child));
            layoutChilds = child.childs;
            return false;
          }
          return true;
        });

        if (node.childs.length > 0) removeChildFromParent(node.childs, node);
      });
    };

    // ✅ Nếu object đã tồn tại trong cây, loại bỏ nó trước khi chèn lại
    if (!isNewObject) {
      removeChildFromParent([newData], null);
    }

    // ✅ Khi thêm vào `grid` hoặc `flex`, giữ lại `dataSlice`
    const addToGridOrFlex = (nodes) => {
      nodes.forEach((node) => {
        if (
          node.id === over_id &&
          (node.type === "grid" || node.type === "flex")
        ) {
          node.childs.push({
            ...(isNewObject ? detail : activeItemBackup),
            id,
            childs: layoutChilds,
            dataSlice: activeItemBackup?.dataSlice || detail.dataSlice, // ✅ Giữ `dataSlice`
          });
        } else if (node.childs.length > 0) {
          addToGridOrFlex(node.childs);
        }
      });
    };

    // ✅ **Hàm hoán đổi vị trí Grid <-> Flex**
    const swapGridFlex = (nodes, parent = null) => {
      nodes.forEach((node) => {
        let overIndex = _.findIndex(node.childs, { id: over_id });
        let activeIndex = _.findIndex(node.childs, { id: id });

        if (overIndex !== -1 && activeIndex !== -1) {
          console.log("🔄 Hoán đổi vị trí Grid <-> Flex", {
            active: node.childs[activeIndex],
            over: node.childs[overIndex],
          });

          // ✅ **Lưu lại cả `activeItem` và `overItem`**
          const activeBackup = { ...node.childs[activeIndex] };
          const overBackup = { ...node.childs[overIndex] };

          // ✅ **Hoán đổi vị trí giữa `activeItem` và `overItem`**
          [node.childs[activeIndex], node.childs[overIndex]] = [
            overBackup,
            activeBackup,
          ];

          console.log("✅ Sau khi hoán đổi", {
            active: node.childs[activeIndex],
            over: node.childs[overIndex],
          });
        } else {
          swapGridFlex(node.childs, node);
        }
      });
    };

    const replaceAndShift = (nodes) => {
      nodes.forEach((node, index) => {
        let overIndex = _.findIndex(node.childs, { id: over_id });
        let overItem = _.find(node.childs, { id: over_id });
        let activeIndex = _.findIndex(node.childs, { id: id });
        // ✅ Nếu `activeId` và `over_id` cùng cấp, hoán đổi vị trí
        if (
          overIndex !== -1 &&
          activeIndex !== -1 &&
          overIndex !== activeIndex
        ) {
          console.log("replaceAndShift22");

          // ✅ Hoán đổi vị trí giữa `activeId` và `over_id`
          [node.childs[activeIndex], node.childs[overIndex]] = [
            node.childs[overIndex],
            node.childs[activeIndex],
          ];
          return; // ✅ Không cần thực hiện thay thế hoặc xóa thêm
        }

        if (
          overIndex !== -1 &&
          overItem &&
          overItem.type !== "grid" &&
          overItem.type !== "flex"
        ) {
          console.log("replaceAndShift33");

          // ✅ Lưu toàn bộ dữ liệu của `overItem`
          const backupOverItem = { ...overItem };

          // ✅ Ensure Dragged Object is Not Lost
          let activeItemData = isNewObject ? detail : activeItemBackup;

          // ✅ Kiểm tra nếu `activeId` đã tồn tại trong `node.childs`, thì không cần xóa `over_id`
          const existingActiveIndex = _.findIndex(node.childs, { id: id });

          if (existingActiveIndex !== -1) {
            console.warn(
              `⚠️ Object ${id} đã tồn tại trong danh sách child, bỏ qua xóa over_id.`
            );
          } else {
            // ✅ Chỉ xóa `over_id` nếu object đang kéo không tồn tại sẵn
            node.childs.splice(overIndex, 1);
          }

          // ✅ Chèn object đang kéo vào đúng vị trí `over_id`
          node.childs.splice(overIndex, 0, {
            ...activeItemData,
            id,
            childs: layoutChilds,
          });

          // ✅ Đẩy `overItem` xuống nếu nó chưa tồn tại
          if (!node.childs.some((child) => child.id === backupOverItem.id)) {
            node.childs.splice(overIndex + 1, 0, backupOverItem);
          }
        } else {
          // console.log("replaceAndShift else");

          replaceAndShift(node.childs);
        }
      });
    };

    // 🛠 Nếu kéo vào `grid` tổng lớn nhất (`root`), thêm vào `childs` của `root`
    if (parent_id === "root") {
      newData.childs.push({
        id,
        columns: detail.columns,
        rows: detail.rows,
        colspan: detail.colspan,
        rowspan: detail.rowspan,
        gap: detail.gap,
        justifyContent: detail.justifyContent,
        alignItems: detail.alignItems,
        type: detail.type,
        childs: layoutChilds,
        thumbnail: detail.thumbnail,
        dataSlice: activeItemBackup?.dataSlice || detail.dataSlice, // ✅ Giữ `dataSlice`
      });
    } else {
      const isActiveGridOrFlex =
        detail.type === "grid" || detail.type === "flex";
      const isOverGridOrFlex = type === "grid" || type === "flex";
      if (allowSwapGridFlex && isActiveGridOrFlex && isOverGridOrFlex) {
        console.log("allowSwapGridFlex");

        swapGridFlex([newData]); // 🔄 Hoán đổi vị trí Grid <-> Flex
      } else if (
        (isActiveGridOrFlex && isOverGridOrFlex) ||
        (!allowSwapGridFlex && !isActiveGridOrFlex && isOverGridOrFlex)
      ) {
        console.log("addToGridOrFlex");
        addToGridOrFlex([newData]);
      } else if (
        (!isActiveGridOrFlex && !isOverGridOrFlex) ||
        (!allowSwapGridFlex && isActiveGridOrFlex && !isOverGridOrFlex)
      ) {
        console.log("replaceAndShift");

        replaceAndShift([newData]);
      }
    }

    // ✅ Khi kéo, cập nhật vị trí nhưng KHÔNG dispatch Redux
    if (liveUpdate) {
      console.log("🔄 Cập nhật vị trí Live (Chưa lưu Redux)", { id, over_id });
      return;
    }

    dispatch(setData(newData));
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
      FindToAdd({
        id: active.id.toString(),
        detail: active.data.current,
        parent_id: over.data.current?.parentId ?? over.id.toString(), // 🔥 Lấy parent_id chính xác
        over_id: over.id.toString(),
        type: over.data.current.type,
      });

      if (deepLevel <= 6) {
        const updatedSidebar = sidebar.filter((sb) => sb.id !== active.id);
        dispatch(setSidebar(updatedSidebar));
      }
    }
  };
  
  function findContainer(id, node) {
    if (!node) return null; // If node is null, return null
    if (node.id === id) return node; // Found the node, return it

    // If node has children, search recursively in the children array
    for (const child of node.childs || []) {
      const found = findContainer(id, child);
      if (found) return found;
    }

    return null; // If not found, return null
  }

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over || !active) return;

    const tempData = JSON.parse(JSON.stringify(dataLayout)); // Tạo bản sao layout tạm thời

    if (active.id !== over.id) {
      console.log("🟢 Thay đổi vị trí ngay khi kéo", { active, over });

      FindToAdd({
        id: active.id.toString(),
        detail: active.data.current,
        parent_id: over.data.current?.parentId ?? over.id.toString(),
        over_id: over.id.toString(),
        type: over?.data?.current?.type || "",
        liveUpdate: true, // ✅ Cập nhật trực tiếp mà không dispatch Redux
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
      {/* Checkbox để bật/tắt chế độ cho phép Grid/Flex đổi chỗ */}
      <label className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          checked={allowSwapGridFlex}
          onChange={(e) => setAllowSwapGridFlex(e.target.checked)}
        />
        Cho phép Grid & Flex đổi vị trí thay vì lồng vào nhau
      </label>

      <DndContext
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <RenderToolbarMonaco hidden={!activeCreateFunction} />
        <div className="flex items-start w-full relative">
          {renderBin}
          {renderSidebar}
          <div
            className={`${
              activeCreateFunction ? "w-1/3" : "w-full"
            } bg-white p-6 z-10`}
          >
            <div className="bg-white mx-auto w-full min-h-[calc(100vh-7rem)]">
              <Droppable
                columns={_.get(dataLayout, "columns")}
                rows={_.get(dataLayout, "rows")}
                colspan={_.get(dataLayout, "colspan")}
                rowspan={_.get(dataLayout, "rowspan")}
                alignItems={_.get(dataLayout, "alignItems")}
                justifyContent={_.get(dataLayout, "justifyContent")}
                gap={_.get(dataLayout, "gap")} 
                type={_.get(dataLayout, "type")}
                id={_.get(dataLayout, "id")}
                thumbnail={_.get(dataLayout, "thumbnail")}
                dataSlice={_.get(dataLayout, "dataSlice")}
              >
                {dataLayout && (
                  <ItemsRenderer
                    childs={_.get(dataLayout, "childs")}
                    id={_.get(dataLayout, "id")}
                    columns={_.get(dataLayout, "columns")}
                    rows={_.get(dataLayout, "rows")}
                    colspan={_.get(dataLayout, "colspan")}
                    rowspan={_.get(dataLayout, "rowspan")}
                    alignItems={_.get(dataLayout, "alignItems")}
                    justifyContent={_.get(dataLayout, "justifyContent")}
                    gap={_.get(dataLayout, "gap")}
                    currentDepth={1}
                    type={_.get(dataLayout, "type")}
                    dataSlice={_.get(data, "dataSlice")}
                    thumbnail={_.get(dataLayout, "thumbnail")}
                    style={_.get(dataLayout, "style")}
                  />
                )}
              </Droppable>
            </div>
          </div>
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

const RenderMonacoEditor = ({ hidden }) => {
  return (
    !hidden && (
      <div className="w-2/3">
        <MonacoEditor />
      </div>
    )
  );
};

const RenderToolbarMonaco = ({ hidden }) => {
  return (
    !hidden && (
      <div className="w-full flex justify-end items-center gap-2 p-2">
        <BtnHandleCreateFc />
        <BtnPublish />
      </div>
    )
  );
};

export default Editor;
