import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
  setColspan,
  setColumns,
  setData,
  setRows,
  setRowspan,
} from "../../store/DndSlice";
import {RootState} from "../../store";

const PropertiesBar = () => {
  const dispatch = useDispatch();
  const {activeData, activeId} = useSelector(
    (state: RootState) => state.dndSlice
  );

  const [columns, setColumnsState] = useState<number>(
    Number(activeData?.columns) || 0
  );
  const [rows, setRowsState] = useState<number>(Number(activeData?.rows) || 0);
  const [colspan, setColspanState] = useState<number>(
    Number(activeData?.colspan) || 0
  );
  const [rowspan, setRowspanState] = useState<number>(
    Number(activeData?.rowspan) || 0
  );

  useEffect(() => {
    if (activeData) {
      setColumnsState(Number(activeData.columns) || 0);
      setRowsState(Number(activeData.rows) || 0);
      setColspanState(Number(activeData.colspan) || 0);
      setRowspanState(Number(activeData.rowspan) || 0);
    }
  }, [activeData]);

  const handleColumnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColumns = Number(e.target.value);
    if (!isNaN(newColumns)) {
      setColumnsState(newColumns);
      dispatch(setColumns(newColumns));
    }
  };

  const handleRowChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRows = Number(e.target.value);
    if (!isNaN(newRows)) {
      setRowsState(newRows);
      dispatch(setRows(newRows));
    }
  };

  const handleColspanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColspan = Number(e.target.value);
    if (!isNaN(newColspan)) {
      setColspanState(newColspan);
      dispatch(setColspan(newColspan));
    }
  };

  const handleRowspanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRowspan = Number(e.target.value);
    if (!isNaN(newRowspan)) {
      setRowspanState(newRowspan);
      dispatch(setRowspan(newRowspan));
    }
  };

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
                type="number"
                value={columns}
                onChange={handleColumnChange}
                className="h-10 w-full border rounded-lg focus-visible:outline-none px-3"
                min="0"
              />
            </div>
            <div className="flex flex-col items-start mt-3">
              <span>Rows</span>
              <input
                type="number"
                value={rows}
                onChange={handleRowChange}
                className="h-10 w-full border rounded-lg focus-visible:outline-none px-3"
                min="0"
              />
            </div>
            <div className="flex flex-col items-start mt-3">
              <span>Columns span</span>
              <input
                type="number"
                value={colspan}
                onChange={handleColspanChange}
                className="h-10 w-full border rounded-lg focus-visible:outline-none px-3"
                min="1"
              />
            </div>
            <div className="flex flex-col items-start mt-3">
              <span>Rows span</span>
              <input
                type="number"
                value={rowspan}
                onChange={handleRowspanChange}
                className="h-10 w-full border rounded-lg focus-visible:outline-none px-3"
                min="1"
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
