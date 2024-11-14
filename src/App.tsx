import React, { useEffect } from "react";
import Sidebar from "./components/sidebar";
import Droppable from "./components/droppable";
import ItemsRenderer from "./features";
import {
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverlay,
  pointerWithin,
} from "@dnd-kit/core";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store";
import {
  Obj,
  setActiveData,
  setActiveId,
  setData,
  setSidebar,
} from "./store/DndSlice";
import PropertiesBar from "./components/propertiesbar/propertiesbar";

const App: React.FC = () => {
  const { activeId, activeData, data, sidebar } = useSelector(
    (state: RootState) => state.dndSlice
  );
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(activeId + " is dragging");
  }, [activeId]);

const FindToAdd = (id: string, detail: any, parent_id: string) => {
  const newData = JSON.parse(JSON.stringify(data));

  const removeChildFromParent = (nodes: Obj[]) => {
    nodes.forEach(node => {
      // Tìm và xóa item với `id` khỏi `node.childs`
      node.childs = node.childs.filter(child => child.id !== id);

      // Đệ quy nếu `node.childs` có phần tử con
      if (node.childs.length > 0) {
        removeChildFromParent(node.childs);
      }
    });
  };

  // Xóa item khỏi layout gốc
  removeChildFromParent([newData]);

  const addChildToParent = (nodes: Obj[]) => {
    nodes.forEach(node => {
      // Nếu `node.id` là `parent_id` và `node.childs` không chứa `id` thì thêm mới
      if (
        node.id === parent_id &&
        !node.childs.some(child => child.id === id)
      ) {
        node.childs = [
          ...node.childs,
          {
            id,
            columns: detail.columns,
            rows: detail.rows,
            type: detail.type,
            childs: [],
          },
        ];
      } else if (node.childs.length > 0) {
        // Đệ quy vào `childs` nếu `node.childs` có phần tử
        addChildToParent(node.childs);
      }
    });
  };

  addChildToParent([newData]);

  dispatch(setData(newData));

  setTimeout(() => {
    console.log("Updated Data:", newData);
  }, 1000);
};

const handleDragEnd = (event: DragEndEvent) => {
  const { over, active } = event;

  if (over && active.id !== over.id) {
    FindToAdd(active.id.toString(), activeData, over.id.toString());

    console.log("Sidebar before filter:", sidebar);
    const updatedSidebar = sidebar.filter(sb => sb.id !== active.id);
    dispatch(setSidebar(updatedSidebar));
    console.log("Sidebar after filter:", updatedSidebar);
    dispatch(setActiveId(null));
    dispatch(setActiveData(null));
  }
};

  const handleDragMove = (event: DragMoveEvent) => {
    console.log(event);
  };

  return (
    <DndContext
      collisionDetection={pointerWithin}
      onDragStart={(e: DragEndEvent) => {
        console.log(e.active.data.current);

        dispatch(setActiveId(e.active.id));
        dispatch(setActiveData(e.active.data.current));
      }}
      onDragEnd={handleDragEnd}
      onDragMove={handleDragMove}>
      <div className="flex items-start w-full bg-violet-100">
        <Sidebar />
        <div className="bg-violet-100 w-full p-6 z-10">
          <div className="bg-white mx-auto max-w-[75rem] w-full min-h-screen">
            <Droppable
              detail={{
                columns: data.columns,
                rows: data.rows,
                type: data.type,
              }}
              id={data.id}>
              <ItemsRenderer
                childs={data.childs}
                id={data.id}
                columns={data.columns}
                rows={data.rows}
                currentDepth={1}
                type={data.type}
              />
            </Droppable>
          </div>
        </div>
        <PropertiesBar />
      </div>
      <DragOverlay
        style={{
          zIndex: 9999,
          pointerEvents: "none",
          position: "fixed",
        }}>
        {activeId ? (
          <div
            className="bg-slate-200 w-full h-full"
            style={{ zIndex: 9999 }}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default App;
