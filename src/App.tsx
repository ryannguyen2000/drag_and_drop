import React, {useEffect} from "react";
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
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "./store";
import {
  Obj,
  setActiveData,
  setActiveId,
  setColspan,
  setColumns,
  setData,
  setProperties,
  setRows,
  setRowspan,
  setSidebar,
} from "./store/DndSlice";
import PropertiesBar from "./components/propertiesbar/propertiesbar";

const App: React.FC = () => {
  const {activeId, activeData, data, sidebar} = useSelector(
    (state: RootState) => state.dndSlice
  );
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(activeId + " is dragging");
  }, [activeId]);
  
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
  }
};

const handleDragMove = (event: DragMoveEvent) => {};

return (
  <DndContext
    collisionDetection={pointerWithin}
    onDragStart={(e: DragEndEvent) => {
      dispatch(setColumns(e.active.data.current.columns));
      dispatch(setRows(e.active.data.current.rows));
      dispatch(setColspan(e.active.data.current.colspan));
      dispatch(setRowspan(e.active.data.current.rowspan));

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
              colspan: data.colspan,
              rowspan: data.rowspan,
              type: data.type,
            }}
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
        zIndex: 9999,
        pointerEvents: "none",
        position: "fixed",
      }}>
      {activeId ? (
        <div className="bg-slate-50 w-full h-full" style={{ zIndex: 9999 }} />
      ) : null}
    </DragOverlay>
  </DndContext>
);
};

export default App;
