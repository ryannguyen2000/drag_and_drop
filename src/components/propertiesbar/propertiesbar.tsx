import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
  Obj,
  setColspan,
  setColumns,
  setData,
  setRows,
  setRowspan,
} from "../../store/DndSlice";
import {RootState} from "../../store";

const PropertiesBar = () => {
  const {col, row, colspan, rowspan, activeId, data} = useSelector(
    (state: RootState) => state.dndSlice
  );

  useEffect(() => {
    if (
      Number(col) > 0 &&
      Number(row) > 0 &&
      Number(rowspan) > 0 &&
      Number(colspan) > 0
    ) {
      const ls = JSON.parse(JSON.stringify(data));

      const mapToReplaceProperties = (data: Obj[]) => {
        data.forEach((node) => {
          if (node.id === activeId) {
            node.columns = col;
            node.rows = row;
            node.colspan = colspan;
            node.rowspan = rowspan;
          } else if (node.childs.length > 0) {
            mapToReplaceProperties(node.childs);
          }
        });
      };

      if (activeId === ls.id) {
        ls.columns = col;
        ls.rows = row;
        ls.colspan = colspan;
        ls.rowspan = rowspan;
      } else {
        mapToReplaceProperties(ls.childs);
      }

      dispatch(setData(ls));
    }
  }, [col, row, rowspan, colspan]);

  const dispatch = useDispatch();
  return (
    <>
      {activeId && (
        <div className="h-[calc(100vh-4rem)] w-full sticky top-4 right-0 rounded-l-xl flex-col gap-12 flex items-center bg-white rounded-lg p-6 max-w-96 z-50">
          <span className="mx-auto w-full text-end font-bold text-3xl">
            Properties
          </span>
          <div className="flex flex-col w-full">
            <div className="flex flex-col items-start mt-3">
              <span>Columns</span>
              <input
                type="text"
                value={col}
                onChange={(e) => dispatch(setColumns(e.target.value))}
                className="h-10 w-full border rounded-lg focus-visible:outline-none px-3"
              />
            </div>
            <div className="flex flex-col items-start mt-3">
              <span>Rows</span>
              <input
                type="text"
                value={row}
                onChange={(e) => dispatch(setRows(e.target.value))}
                className="h-10 w-full border rounded-lg focus-visible:outline-none px-3"
              />
            </div>
            <div className="flex flex-col items-start mt-3">
              <span>Columns span</span>
              <input
                type="text"
                value={colspan}
                onChange={(e) => dispatch(setColspan(e.target.value))}
                className="h-10 w-full border rounded-lg focus-visible:outline-none px-3"
              />
            </div>
            <div className="flex flex-col items-start mt-3">
              <span>Rows span</span>
              <input
                type="text"
                value={rowspan}
                onChange={(e) => dispatch(setRowspan(e.target.value))}
                className="h-10 w-full border rounded-lg focus-visible:outline-none px-3"
              />
            </div>
            <button
              onClick={() => console.log("result: ")}
              className="mt-12 w-full h-12 bg-green-100 hover:bg-violet-100 transition-all duration-500 rounded-full"
            >
              Publish
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PropertiesBar;
