import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setData} from "../../store/DndSlice";
import {RootState} from "../../store";
import exportFromJSON from "export-from-json";
import {Obj} from "../../DndSlice";

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

  const [isLayout, setIsLayout] = useState<boolean>(false);

  useEffect(() => {
    if (activeId) {
      if (data.id === activeId) {
        data.type === "layout" ? setIsLayout(true) : setIsLayout(false);
      }
      const getDetail = (childs: any[]) => {
        childs.map((child) => {
          if (child.id === activeId) {
            child.type === "layout" ? setIsLayout(true) : setIsLayout(false);
            setColumnsState(Number(child.columns));
            setRowsState(Number(child.rows));
            setColspanState(Number(child.colspan));
            setRowspanState(Number(child.rowspan));
            console.log(child);
          }
          if (child.childs) {
            getDetail(child.childs);
          }
        });
      };
      getDetail(data.childs);
    }
  }, [activeId]);

  const SetPropertyJson = (id: any) => {
    const copyData: Obj = JSON.parse(JSON.stringify(data));
    if (id === copyData.id) {
      const childsList = copyData.childs;
      dispatch(
        setData({
          ...copyData,
          columns: columns.toString(),
          rows: rows.toString(),
          colspan: colspan.toString(),
          rowspan: rowspan.toString(),
          childs: childsList,
        })
      );
      return;
    }

    function RefactorData(child: Obj[]): Obj[] {
      return child.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            columns: columns.toString(),
            rows: rows.toString(),
            colspan: colspan.toString(),
            rowspan: rowspan.toString(),
          };
        }

        if (item.childs) {
          return {
            ...item,
            childs: RefactorData(item.childs),
          };
        }

        return item;
      });
    }

    const updatedChilds = RefactorData(copyData.childs);
    dispatch(setData({...copyData, childs: updatedChilds}));
  };

  useEffect(() => {
    SetPropertyJson(activeId);
  }, [colspan, rowspan, columns, rows]);

  const handleColumnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColumnsState(e.target.value);
  };

  const handleRowChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsState(e.target.value);
  };

  const handleColspanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColspanState(e.target.value);
  };

  const handleRowspanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowspanState(e.target.value);
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
        <div className="h-[calc(100vh-4rem)] w-full sticky top-4 right-0 rounded-l-xl flex-col gap-12 flex items-center bg-gray-100 rounded-lg p-6 max-w-96 z-50">
          <span className="mx-auto w-full text-end font-bold text-3xl">
            Properties
          </span>
          <div className="flex flex-col w-full">
            {isLayout && (
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
            )}
            {isLayout && (
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
            )}
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
              className="mt-12 w-full h-12 bg-black text-white rounded-full">
              Publish
            </button>
            <button
              onClick={() => handleDownloadAsJson()}
              className="mt-12 w-full h-12 bg-black text-white rounded-full">
              Download as JSON
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PropertiesBar;
