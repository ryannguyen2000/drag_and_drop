import React, {useEffect, useState} from "react";
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
  setData,
  setSidebar,
} from "./store/DndSlice";
import PropertiesBar from "./components/propertiesbar/propertiesbar";

const App: React.FC = () => {
  const {activeId, activeData, data, sidebar} = useSelector(
    (state: RootState) => state.dndSlice
  );
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(activeId + "Is dragging");
  }, [activeId]);

  const FindToAdd = (id: string, detail: any, parent_id: string) => {
    const newData = JSON.parse(JSON.stringify(data));

    const addChildToParent = (nodes: Obj[]) => {
      nodes.forEach((node) => {
        if (node.id === parent_id) {
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
          addChildToParent(node.childs);
        }
      });
    };

    if (newData.id === parent_id) {
      newData.childs.push({
        id,
        columns: detail.columns,
        rows: detail.rows,
        type: detail.type,
        childs: [],
      });
    } else {
      addChildToParent(newData.childs);
    }

    dispatch(setData(newData));

    dispatch(setSidebar(sidebar.filter((sb) => sb.id !== id)));

    setTimeout(() => {
      console.log("Updated Data:", newData);
    }, 1000);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    console.log(event);

    const {over, active} = event;
    if (over && active.id !== over.id) {
      FindToAdd(active.id.toString(), activeData, over.id.toString());
      console.log(active.id + ":" + over.id);
      console.log(event.active.data.current);

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
      onDragMove={handleDragMove}
    >
      <div className="flex items-start w-full bg-violet-100">
        <Sidebar />
        <div className="bg-violet-100 w-full p-6 z-10">
          <div className="bg-white mx-auto max-w-[75rem] w-full min-h-screen">
            <Droppable
              detail={{columns: data.columns, rows: data.rows, type: data.type}}
              id={data.id}
            >
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
        }}
      >
        {activeId ? (
          <div className="bg-slate-200 w-full h-full" style={{zIndex: 9999}} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default App;

// {
//   "id": "root",
//   "type": "layout",
//   "columns": "2",
//   "rows": "2",
//   "childs": [
//     {
//       "id": "layout1",
//       "type": "layout",
//       "columns": "2",
//       "rows": "2",
//       "childs": [
//         {
//           "id": "item1",
//           "type": "content",
//           "columns": "2",
//           "rows": "2",
//           "childs": []
//         },
//         {
//           "id": "item2",
//           "type": "content",
//           "columns": "2",
//           "rows": "2",
//           "childs": []
//         }
//       ]
//     },
//     {
//       "id": "item3",
//       "type": "content",
//       "columns": "2",
//       "rows": "2",
//       "childs": []
//     },
//     {
//       "id": "layout2",
//       "type": "content",
//       "columns": "2",
//       "rows": "2",
//       "childs": [
//         {
//           "id": "item4",
//           "type": "layout",
//           "columns": "2",
//           "rows": "2",
//           "childs": [
//             {
//               "id": "item5",
//               "type": "content",
//               "columns": "2",
//               "rows": "2",
//               "childs": []
//             },
//             {
//               "id": "item6",
//               "type": "content",
//               "columns": "2",
//               "rows": "2",
//               "childs": []
//             }
//           ]
//         }
//       ]
//     }
//   ]
// }
