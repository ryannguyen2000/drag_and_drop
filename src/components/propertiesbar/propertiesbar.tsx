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
import exportFromJSON from "export-from-json";

const PropertiesBar = () => {
  const dispatch = useDispatch();
  const {activeData, activeId, data} = useSelector(
    (state: RootState) => state.dndSlice
  );

  const [columns, setColumnsState] = useState<number | string>(
    Number(activeData?.columns) || ""
  );
  const [rows, setRowsState] = useState<number | string>(
    Number(activeData?.rows) || ""
  );
  const [colspan, setColspanState] = useState<number | string>(
    Number(activeData?.colspan) || ""
  );
  const [rowspan, setRowspanState] = useState<number | string>(
    Number(activeData?.rowspan) || ""
  );

  useEffect(() => {
    if (activeData) {
      setColumnsState(Number(activeData.columns) || "");
      setRowsState(Number(activeData.rows) || "");
      setColspanState(Number(activeData.colspan) || "");
      setRowspanState(Number(activeData.rowspan) || "");
    }
  }, [activeData]);

  const handleColumnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColumns = Number(e.target.value);
    if (!isNaN(newColumns)) {
      // Only update state if the current value is 0 and the new value is not 0
      setColumnsState((prevState) =>
        prevState === 0 ? newColumns : newColumns
      );
      dispatch(setColumns(newColumns));
    }
  };

  const handleRowChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRows = Number(e.target.value);
    if (!isNaN(newRows)) {
      // Only update state if the current value is 0 and the new value is not 0
      setRowsState((prevState) => (prevState === 0 ? newRows : newRows));
      dispatch(setRows(newRows));
    }
  };

  const handleColspanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColspan = Number(e.target.value);
    if (!isNaN(newColspan)) {
      // Only update state if the current value is 0 and the new value is not 0
      setColspanState((prevState) =>
        prevState === 0 ? newColspan : newColspan
      );
      dispatch(setColspan(newColspan));
    }
  };

  const handleRowspanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRowspan = Number(e.target.value);
    if (!isNaN(newRowspan)) {
      // Only update state if the current value is 0 and the new value is not 0
      setRowspanState((prevState) =>
        prevState === 0 ? newRowspan : newRowspan
      );
      dispatch(setRowspan(newRowspan));
    }
  };

  const handleDownloadAsJson = () => {
    const fileName = "JsonLayout";
    const exportType = exportFromJSON.types.json;

    exportFromJSON({data, fileName, exportType});
  };

  function handlePublishJsonData(): void {
    throw new Error("Function not implemented.");
  }

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
              onClick={() => handlePublishJsonData()}
              className="mt-12 w-full h-12 bg-green-100 hover:bg-violet-100 transition-all duration-500 rounded-full"
            >
              Publish
            </button>
            <button
              onClick={() => handleDownloadAsJson()}
              className="mt-12 w-full h-12 bg-green-100 hover:bg-violet-100 transition-all duration-500 rounded-full"
            >
              Download as JSON
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PropertiesBar;
