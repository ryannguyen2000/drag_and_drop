import React, { useEffect, useRef, useState } from "react";
import Sidebar from "./components/sidebar";
import Droppable from "./components/droppable";
import ItemsRenderer from "./features";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  pointerWithin,
} from "@dnd-kit/core";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store";
import { Obj, setData, setSidebar } from "./store/DndSlice";
import PropertiesBar from "./components/propertiesbar/propertiesbar";
import TrashBin from "./components/trashBin";

const App: React.FC = () => {
  const { activeId, data, sidebar } = useSelector(
    (state: RootState) => state.dndSlice
  );
  const dispatch = useDispatch();
  const FindToAdd = (id: string, detail: any, parent_id: string) => {
    const newData = JSON.parse(JSON.stringify(data));

    let layoutChilds: Obj[] = [];

    const removeChildFromParent = (nodes: Obj[]) => {
      nodes.forEach(node => {
        const targetChild = node.childs.find(child => child.id === id);
        if (targetChild) {
          layoutChilds = targetChild.childs;
        }
        node.childs = node.childs.filter(child => child.id !== id);

        if (node.childs.length > 0) {
          removeChildFromParent(node.childs);
        }
      });
    };

    removeChildFromParent([newData]);

    const addChildToParent = (nodes: Obj[]) => {
      nodes.forEach(node => {
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
              colspan: detail.colspan,
              rowspan: detail.rowspan,
              type: detail.type,
              childs: layoutChilds,
            },
          ];
        } else if (node.childs.length > 0) {
          addChildToParent(node.childs);
        }
      });
    };

    if (newData.id === parent_id) {
      newData.childs.push({
        id,
        columns: detail.columns,
        rows: detail.rows,
        colspan: detail.colspan,
        rowspan: detail.rowspan,
        type: detail.type,
        childs: layoutChilds,
      });
    } else {
      addChildToParent(newData.childs);
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
      const newData = JSON.parse(JSON.stringify(data));
      const removeItem = (nodes: Obj[]): Obj[] =>
        nodes
          .filter(node => node.id !== active.id)
          .map(node => ({
            ...node,
            childs: removeItem(node.childs),
          }));

      newData.childs = removeItem(newData.childs);
      dispatch(setData(newData));
      return;
    }

    if (over && active.id !== over.id) {
      FindToAdd(active.id.toString(), active.data.current, over.id.toString());

      const updatedSidebar = sidebar.filter(sb => sb.id !== active.id);
      dispatch(setSidebar(updatedSidebar));
    }
  };

  return (
    <DndContext
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}>
      <div className="flex items-start w-full bg-gray-100 border-2relative">
        {
          <div
            id="bin_id"
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 mb-[100px] hidden justify-center items-center"
            style={{
              zIndex: 9999,
            }}>
            <TrashBin />
          </div>
        }

        <Sidebar />
        <div className="bg-white w-full p-6 z-10">
          <div className="bg-white mx-auto max-w-[75rem] w-full min-h-screen">
            <Droppable
              columns={data.columns}
              rows={data.rows}
              colspan={data.colspan}
              rowspan={data.rowspan}
              type={data.type}
              id={data.id}>
              <ItemsRenderer
                childs={data.childs}
                id={data.id}
                columns={data.columns}
                rows={data.rows}
                colspan={data.colspan}
                rowspan={data.rowspan}
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
          zIndex: 999,
          pointerEvents: "none",
          position: "fixed",
          opacity: 0.4,
        }}>
        {activeId ? (
          <div
            className="bg-slate-50 opacity-40 w-full h-full rounded-xl"
            style={{ zIndex: 999 }}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default App;
