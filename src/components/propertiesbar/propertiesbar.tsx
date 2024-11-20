import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setData} from "../../store/DndSlice";
import {RootState} from "../../store";
import exportFromJSON from "export-from-json";
import {Obj} from "../../DndSlice";
import axios from "axios";
import {ToastError, ToastSuccess} from "../toast";
import {Icon} from "@iconify/react/dist/iconify.js";

const justifyList = [
  {
    title: "flex-start",
  },
  {
    title: "center",
  },
  {
    title: "flex-end",
  },
  {
    title: "space-between",
  },
  {
    title: "space-around",
  },
  {
    title: "space-evenly",
  },
];
const alignList = [
  {
    title: "flex-start",
  },
  {
    title: "center",
  },
  {
    title: "flex-end",
  },
  {
    title: "stretch",
  },
  {
    title: "baseline",
  },
];

const PropertiesBar = () => {
  const dispatch = useDispatch();
  const {activeData, activeId, data} = useSelector(
    (state: RootState) => state.dndSlice
  );

  const [justifyShow, setJustifyShow] = useState<boolean>(false);
  const [alignShow, setAlignShow] = useState<boolean>(false);

  // properties state
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
  const [gap, setGap] = useState<number | string>(
    Number(activeData?.rowspan) || ""
  );
  const [justifyContent, setJustifyContent] = useState<number | string>(
    Number(activeData?.rowspan) || ""
  );
  const [alignItems, setAlignItems] = useState<number | string>(
    Number(activeData?.rowspan) || ""
  );

  const [isLayout, setIsLayout] = useState<string>("grid");

  useEffect(() => {
    if (activeId) {
      if (data.id === activeId) {
        data.type === "grid"
          ? setIsLayout("grid")
          : data.type === "flex"
          ? setIsLayout("flex")
          : setIsLayout("content");
      }
      const getDetail = (childs: any[]) => {
        childs.map((child) => {
          if (child.id === activeId) {
            child.type === "grid"
              ? setIsLayout("grid")
              : child.type === "flex"
              ? setIsLayout("flex")
              : setIsLayout("content");
            setColumnsState(Number(child.columns));
            setRowsState(Number(child.rows));
            setColspanState(Number(child.colspan));
            setRowspanState(Number(child.rowspan));
            setGap(Number(child.gap));
            setJustifyContent(child.justifyContent);
            setAlignItems(child.alignItems);
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
          gap: gap.toString(),
          justifyContent: justifyContent.toString(),
          alignItems: alignItems.toString(),
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
            gap: gap.toString(),
            justifyContent: justifyContent.toString(),
            alignItems: alignItems.toString(),
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
  }, [colspan, rowspan, columns, rows, gap, justifyContent, alignItems]);

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
  const handleGapChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGap(e.target.value);
  };
  const handleJustifyContentChange = (value: string) => {
    setJustifyContent(value);
  };
  const handleAlignItemsChange = (value: string) => {
    setAlignItems(value);
  };

  const handleDownloadAsJson = () => {
    const fileName = "JsonLayout";
    const exportType = exportFromJSON.types.json;

    exportFromJSON({data, fileName, exportType});
  };

  const handlePublishJsonData = async () => {
    const response = await axios.post(
      "https://serverless-tn-layout-production.up.railway.app/publish",
      data
    );
    if (response.status === 200 || response.status === 201) {
      ToastSuccess({msg: "Published successfully"});
    } else {
      ToastError({msg: "Oops! Something went wrong to available publish"});
    }
  };

  return (
    <>
      {activeId && (
        <div className="h-[calc(100vh)] w-full animate-fade-left animate-duration-500 sticky top-4 right-0 rounded-l-xl flex-col flex items-center bg-gray-100 rounded-lg p-6 max-w-96 z-20 before:absolute before:content[] before:rounded-full before:w-full before:aspect-square before:bg-white before:z-0 before:-translate-y-[57%] overflow-hidden">
          <div className="flex items-center justify-center gap-4 h-fit z-10">
            <button
              onClick={() => handleDownloadAsJson()}
              className="h-10 aspect-square group hover:px-3 flex items-center hover:bg-slate-500 transition-all duration-500 justify-center w-10 hover:w-full  text-sm bg-[#444] text-white rounded-full"
            >
              <Icon icon="ph:arrow-line-down" fontSize={20} />
              <span className="text-nowrap opacity-0 select-none ml-0 group-hover:ml-2 pointer-events-none group-hover:opacity-100 w-0 group-hover:w-full transition-all duration-500">
                Download as JSON
              </span>
            </button>
            <button
              onClick={() => handlePublishJsonData()}
              className="h-10 px-4  text-sm bg-[#444] text-white rounded-full"
            >
              Publish
            </button>
          </div>
          <span className="mx-auto w-full text-center font-semibold text-gray-500 capitalize text-normal  z-10 mt-12">
            Properties of
          </span>

          {isLayout === "content" && (
            <span
              className={`animate-fade-up w-full text-center font-semibold text-3xl capitalize px-4 py-2 z-10`}
            >
              {isLayout}
            </span>
          )}
          {isLayout === "grid" && (
            <span
              className={`animate-fade-up w-full text-center font-semibold text-3xl capitalize px-4 py-2 z-10`}
            >
              {isLayout + " layout"}
            </span>
          )}
          {isLayout === "flex" && (
            <span
              className={`animate-fade-up w-full text-center font-semibold text-3xl capitalize px-4 py-2 z-10`}
            >
              {isLayout + " layout"}
            </span>
          )}

          <div className="flex flex-col w-full z-10 mt-12">
            <div className="grid grid-cols-2 gap-6">
              {isLayout && (
                <div className="flex flex-col items-start mt-3 animate-fade-up">
                  <span className="text-sm font-medium text-gray-400">
                    Columns span
                  </span>
                  <input
                    type="number"
                    value={colspan}
                    onChange={handleColspanChange}
                    className="h-10 w-full border rounded-lg focus-visible:outline-none px-3"
                    min="1"
                  />
                </div>
              )}
              {isLayout && (
                <div className="flex flex-col items-start mt-3 animate-fade-up">
                  <span className="text-sm font-medium text-gray-400">
                    Rows span
                  </span>
                  <input
                    type="number"
                    value={rowspan}
                    onChange={handleRowspanChange}
                    className="h-10 w-full border rounded-lg focus-visible:outline-none px-3"
                    min="1"
                  />
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-6">
              {isLayout === "grid" && (
                <div className="flex flex-col items-start mt-3 animate-fade-up">
                  <span className="text-sm font-medium text-gray-400">
                    Columns
                  </span>
                  <input
                    type="number"
                    value={columns}
                    onChange={handleColumnChange}
                    className="h-10 w-full border rounded-lg focus-visible:outline-none px-3"
                    min="0"
                  />
                </div>
              )}
              {isLayout === "grid" && (
                <div className="flex flex-col items-start mt-3 animate-fade-up">
                  <span className="text-sm font-medium text-gray-400">
                    Rows
                  </span>
                  <input
                    type="number"
                    value={rows}
                    onChange={handleRowChange}
                    className="h-10 w-full border rounded-lg focus-visible:outline-none px-3"
                    min="0"
                  />
                </div>
              )}
            </div>
            {(isLayout === "grid" || isLayout === "flex") && (
              <div className="flex flex-col items-start mt-3 animate-fade-up">
                <span className="text-sm font-medium text-gray-400">Gap</span>
                <input
                  type="number"
                  value={gap}
                  onChange={handleGapChange}
                  className="h-10 w-full border appearance-none rounded-lg focus-visible:outline-none px-3"
                  min="1"
                />
              </div>
            )}
            <div className="grid grid-cols-2 gap-6">
              {isLayout === "flex" && (
                <div className="flex flex-col items-start mt-3 animate-fade-up">
                  <span className="text-sm font-medium text-gray-400">
                    Justify Content
                  </span>
                  <div
                    className={`h-10 relative w-full border border-gray-300 rounded-lg flex-col px-3 py-2 bg-white`}
                    onClick={() =>
                      setJustifyShow((prev) => {
                        !prev === true && setAlignShow(false);
                        return !prev;
                      })
                    }
                  >
                    <span>{justifyContent}</span>
                    <div
                      className={`flex-col rounded-xl absolute w-full left-0 shadow-xl top-full bg-white z-[2] overflow-hidden ${
                        justifyShow ? "flex" : "hidden"
                      }`}
                    >
                      {justifyList.map((item, index) => (
                        <span
                          key={index}
                          className={`w-full hover:bg-slate-100 transition-all duration-500 cursor-pointer px-4 py-2 ${
                            justifyContent === item.title && "bg-slate-100"
                          }`}
                          onClick={() => handleJustifyContentChange(item.title)}
                        >
                          {item.title}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {isLayout === "flex" && (
                <div className="flex flex-col items-start mt-3 animate-fade-up">
                  <span className="text-sm font-medium text-gray-400">
                    Align Items
                  </span>
                  <div
                    className={`h-10 relative w-full border border-gray-300 rounded-lg flex-col px-3 py-2 bg-white `}
                    onClick={() =>
                      setAlignShow((prev) => {
                        !prev === true && setJustifyShow(false);
                        return !prev;
                      })
                    }
                  >
                    <span>{alignItems}</span>
                    <div
                      className={`flex-col rounded-xl absolute top-full shadow-xl z-[2] w-full left-0 bg-white overflow-hidden ${
                        alignShow ? "flex" : "hidden"
                      }`}
                    >
                      {alignList.map((item, index) => (
                        <span
                          key={index}
                          className={`w-full hover:bg-slate-100 transition-all duration-500 cursor-pointer px-4 py-2 ${
                            alignItems === item.title && "bg-slate-100"
                          }`}
                          onClick={() => handleAlignItemsChange(item.title)}
                        >
                          {item.title}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PropertiesBar;
