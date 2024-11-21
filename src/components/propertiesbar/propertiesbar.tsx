import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setData } from "../../store/DndSlice";
import { RootState } from "../../store";
import exportFromJSON from "export-from-json";
import { Obj } from "../../DndSlice";
import axios from "axios";
import { ToastError, ToastSuccess } from "../toast";
import { Icon } from "@iconify/react/dist/iconify.js";
import DimensionInput from "../commom/input";
import { splitDimensions, splitValueAndUnit } from "../../utilities/text";

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
    const { activeData, activeId, data } = useSelector(
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
    const [styles, setStyles] = useState<React.CSSProperties>(activeData?.style)

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
                        setStyles(child.style);
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
                    style: styles,
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
                        style: styles,
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
        dispatch(setData({ ...copyData, childs: updatedChilds }));
    };

    useEffect(() => {
        SetPropertyJson(activeId);
    }, [colspan, rowspan, columns, rows, gap, justifyContent, alignItems, styles]);

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

    const handleDimensionChange = (
        value: string | number,
        property: "width" | "height" | "maxWidth" | "maxHeight",
        unit: string
    ) => {
        if (value === 0 || value === "0") {
            // Không trả về giá trị nếu là 0
            setStyles((prevStyles) => {
                const newStyles = { ...prevStyles };
                delete newStyles[property]; // Xóa thuộc tính nếu giá trị là 0
                return newStyles;
            });
        } else {
            setStyles((prevStyles) => ({
                ...prevStyles,
                [property]: `${value}${unit}`, // Cập nhật giá trị nếu khác 0
            }));
        }
    };


    const handlePaddingChange = (
        value: string | number,
        direction: "top" | "right" | "bottom" | "left",
        unit: string
    ) => {
        setStyles((prevStyles) => {
            const paddingValues = (prevStyles?.padding || "0px 0px 0px 0px")
                .toString() // Đảm bảo là chuỗi
                .split(" "); // Chuyển thành mảng

            const directionIndex = { top: 0, right: 1, bottom: 2, left: 3 }[direction]; // Lấy vị trí
            paddingValues[directionIndex] = `${value}${unit}`; // Cập nhật giá trị kèm unit

            const newPadding = paddingValues.join(" "); // Gộp lại thành chuỗi

            // Kiểm tra nếu tất cả các giá trị là 0
            if (paddingValues.every((val) => val === "0px" || val === "0rem" || val === "0em" || val === "0%")) {
                const { padding, ...rest } = prevStyles; // Loại bỏ padding nếu tất cả giá trị là 0
                return rest;
            }

            return { ...prevStyles, padding: newPadding }; // Cập nhật padding nếu không phải 0
        });
    };

    const handleMarginChange = (
        value: string | number,
        direction: "top" | "right" | "bottom" | "left",
        unit: string
    ) => {
        setStyles((prevStyles) => {
            const marginValues = (prevStyles?.margin || "0px 0px 0px 0px")
                .toString() // Đảm bảo là chuỗi
                .split(" "); // Chuyển thành mảng

            const directionIndex = { top: 0, right: 1, bottom: 2, left: 3 }[direction]; // Lấy vị trí
            marginValues[directionIndex] = `${value}${unit}`; // Cập nhật giá trị kèm unit

            const newMargin = marginValues.join(" "); // Gộp lại thành chuỗi

            // Kiểm tra nếu tất cả các giá trị là 0
            if (marginValues.every((val) => val === "0px" || val === "0rem" || val === "0em" || val === "0%")) {
                const { margin, ...rest } = prevStyles; // Loại bỏ margin nếu tất cả giá trị là 0
                return rest;
            }

            return { ...prevStyles, margin: newMargin }; // Cập nhật margin nếu không phải 0
        });
    };




    useEffect(() => {
        if (styles) {
            console.log("🚀 ~ useEffect ~ styles:", styles)
        }
    }, [styles])

    const handleDownloadAsJson = () => {
        const fileName = "JsonLayout";
        const exportType = exportFromJSON.types.json;

        exportFromJSON({ data, fileName, exportType });
    };

    const handlePublishJsonData = async () => {
        const response = await axios.post(
            "https://serverless-tn-layout-production.up.railway.app/publish",
            data
        );
        if (response.status === 200 || response.status === 201) {
            ToastSuccess({ msg: "Published successfully" });
        } else {
            ToastError({ msg: "Oops! Something went wrong to available publish" });
        }
    };


    return (
        <>
            {activeId && (
                <div className="h-[calc(100vh)] w-full animate-fade-left animate-duration-500 sticky top-4 right-0 rounded-l-xl flex-col flex items-center bg-gray-100 rounded-lg p-6 max-w-96 z-20 before:absolute before:content[] before:rounded-full before:w-full before:aspect-square before:bg-white before:z-0 before:-translate-y-[57%] overflow-scroll">
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
                                            className={`flex-col rounded-xl absolute w-full left-0 shadow-xl top-full bg-white z-[2] overflow-hidden ${justifyShow ? "flex" : "hidden"
                                                }`}
                                        >
                                            {justifyList.map((item, index) => (
                                                <span
                                                    key={index}
                                                    className={`w-full hover:bg-slate-100 transition-all duration-500 cursor-pointer px-4 py-2 ${justifyContent === item.title && "bg-slate-100"
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
                                            className={`flex-col rounded-xl absolute top-full shadow-xl z-[2] w-full left-0 bg-white overflow-hidden ${alignShow ? "flex" : "hidden"
                                                }`}
                                        >
                                            {alignList.map((item, index) => (
                                                <span
                                                    key={index}
                                                    className={`w-full hover:bg-slate-100 transition-all duration-500 cursor-pointer px-4 py-2 ${alignItems === item.title && "bg-slate-100"
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
                        {/* SYTLING */}
                        <div className="flex flex-col w-full mt-6">
                            <div className="border border-slate-300 h-[1px]"></div>
                            <div className="flex flex-col items-start mt-3 animate-fade-up">
                                <span className="text-xl font-medium text-gray-700">Styling</span>
                                <div className="space-y-4 w-full mt-6">
                                    {/* DIMENSION */}
                                    <details className="group w-full [&_summary::-webkit-details-marker]:hidden" open>
                                        <summary
                                            className="flex cursor-pointer w-full items-center justify-between gap-1.5 rounded-lg bg-white p-4 text-gray-900"
                                        >
                                            <span className="font-semibold text-gray-800 capitalize">Dimension</span>
                                            <svg
                                                className="size-5 shrink-0 transition duration-300 group-open:-rotate-180"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </summary>
                                        <ul className="grid grid-cols-2 gap-3 w-full mt-2 p-4 border bg-white shadow-lg rounded-b-xl">
                                            {["width", "height", "maxWidth", "maxHeight"].map((property) => {
                                                // Kiểm tra xem property có tồn tại trong styles hay không
                                                const styleValue = styles?.hasOwnProperty(property) ? styles[property as keyof typeof styles] : "0";

                                                // Tách giá trị và đơn vị
                                                const [defaultValue, defaultUnit] = styleValue
                                                    ? splitValueAndUnit(String(styleValue))
                                                    : ["", ""]; // Sử dụng chuỗi rỗng nếu không có giá trị                                            
                                                return (
                                                    <li key={property}>
                                                        <span className="text-sm font-medium text-gray-400 capitalize">
                                                            {property.replace(/([A-Z])/g, " $1")} {/* Format to "maxWidth" as "Max Width" */}
                                                        </span>
                                                        <DimensionInput
                                                            defaultValue={Number.parseInt(defaultValue)} // Set default value if available
                                                            defaultUnit={defaultUnit} // Set default unit if available
                                                            onChange={(value) =>
                                                                handleDimensionChange(value.inputValue, property as any, value.unit)
                                                            }
                                                        />
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </details>
                                    {/* PADDING */}
                                    <details className="group w-full [&_summary::-webkit-details-marker]:hidden">
                                        <summary className="flex cursor-pointer items-center w-full justify-between gap-1.5 rounded-lg bg-white p-4 text-gray-900">
                                            <span className="font-semibold text-gray-800 capitalize">Padding</span>
                                            <svg className="size-5 shrink-0 transition duration-300 group-open:-rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </summary>

                                        <ul className="grid grid-cols-2 gap-3 w-full mt-2 border p-4 bg-white shadow-lg rounded-b-xl">
                                            {["padding"].map((property) => {
                                                const paddingValue = styles?.hasOwnProperty(property) ? styles[property as keyof typeof styles] : "0px 0px 0px 0px";
                                                const [top, right, bottom, left] = splitDimensions(String(paddingValue));

                                                return (
                                                    <>
                                                        <li key="top">
                                                            <span className="text-sm font-medium text-gray-400">Top</span>
                                                            <DimensionInput
                                                                defaultValue={Number.parseInt(top)} // Chuyển đổi thành số
                                                                defaultUnit={top.replace(/[0-9]/g, "")} // Lấy đơn vị (px, em, rem, ...)
                                                                onChange={(value) => handlePaddingChange(value.inputValue, "top", value.unit)}
                                                            />
                                                        </li>
                                                        <li key="right">
                                                            <span className="text-sm font-medium text-gray-400">Right</span>
                                                            <DimensionInput
                                                                defaultValue={Number.parseInt(right)}
                                                                defaultUnit={right.replace(/[0-9]/g, "")}
                                                                onChange={(value) => handlePaddingChange(value.inputValue, "right", value.unit)}
                                                            />
                                                        </li>
                                                        <li key="bottom">
                                                            <span className="text-sm font-medium text-gray-400">Bottom</span>
                                                            <DimensionInput
                                                                defaultValue={Number.parseInt(bottom)}
                                                                defaultUnit={bottom.replace(/[0-9]/g, "")}
                                                                onChange={(value) => handlePaddingChange(value.inputValue, "bottom", value.unit)}
                                                            />
                                                        </li>
                                                        <li key="left">
                                                            <span className="text-sm font-medium text-gray-400">Left</span>
                                                            <DimensionInput
                                                                defaultValue={Number.parseInt(left)}
                                                                defaultUnit={left.replace(/[0-9]/g, "")}
                                                                onChange={(value) => handlePaddingChange(value.inputValue, "left", value.unit)}
                                                            />
                                                        </li>
                                                    </>
                                                );
                                            })}
                                        </ul>
                                    </details>

                                    {/* MARGIN */}
                                    <details className="group w-full [&_summary::-webkit-details-marker]:hidden">
                                        <summary className="flex cursor-pointer w-full items-center justify-between gap-1.5 rounded-lg bg-white p-4 text-gray-900">
                                            <span className="font-semibold text-gray-800 capitalize">Margin</span>
                                            <svg className="size-5 shrink-0 transition duration-300 group-open:-rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </summary>

                                        <ul className="grid grid-cols-2 gap-3 w-full mt-2 p-4 bg-white shadow-lg rounded-b-xl">
                                            {["margin"].map((property) => {
                                                const marginValue = styles?.hasOwnProperty(property) ? styles[property as keyof typeof styles] : "0px 0px 0px 0px";
                                                const [top, right, bottom, left] = splitDimensions(String(marginValue));

                                                return (
                                                    <>
                                                        <li key="top">
                                                            <span className="text-sm font-medium text-gray-400">Top</span>
                                                            <DimensionInput
                                                                defaultValue={Number.parseInt(top)} // Chuyển đổi thành số
                                                                defaultUnit={top.replace(/[0-9]/g, "")} // Lấy đơn vị (px, em, rem, ...)
                                                                onChange={(value) => handleMarginChange(value.inputValue, "top", value.unit)}
                                                            />
                                                        </li>
                                                        <li key="right">
                                                            <span className="text-sm font-medium text-gray-400">Right</span>
                                                            <DimensionInput
                                                                defaultValue={Number.parseInt(right)}
                                                                defaultUnit={right.replace(/[0-9]/g, "")}
                                                                onChange={(value) => handleMarginChange(value.inputValue, "right", value.unit)}
                                                            />
                                                        </li>
                                                        <li key="bottom">
                                                            <span className="text-sm font-medium text-gray-400">Bottom</span>
                                                            <DimensionInput
                                                                defaultValue={Number.parseInt(bottom)}
                                                                defaultUnit={bottom.replace(/[0-9]/g, "")}
                                                                onChange={(value) => handleMarginChange(value.inputValue, "bottom", value.unit)}
                                                            />
                                                        </li>
                                                        <li key="left">
                                                            <span className="text-sm font-medium text-gray-400">Left</span>
                                                            <DimensionInput
                                                                defaultValue={Number.parseInt(left)}
                                                                defaultUnit={left.replace(/[0-9]/g, "")}
                                                                onChange={(value) => handleMarginChange(value.inputValue, "left", value.unit)}
                                                            />
                                                        </li>
                                                    </>
                                                );
                                            })}
                                        </ul>
                                    </details>
                                    {/* BACKGROUND */}
                                    <details className="group w-full  [&_summary::-webkit-details-marker]:hidden">
                                        <summary
                                            className="flex cursor-pointer w-full items-center justify-between gap-1.5 rounded-lg bg-white p-4 text-gray-900"
                                        >
                                            <span className="font-semibold text-gray-800 capitalize">Background</span>
                                            <svg
                                                className="size-5 shrink-0 transition duration-300 group-open:-rotate-180"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </summary>

                                        <ul className="grid grid-cols-2 gap-3 w-full mt-2 p-4 bg-white shadow-lg rounded-b-xl">
                                            <li>
                                                <span className="text-sm font-medium text-gray-400">
                                                    Top
                                                </span>
                                                <div className="flex items-center justify-center gap-2">
                                                    <input
                                                        type="number"
                                                        className="h-10 w-full border border-gray-300 rounded-lg focus-visible:outline-none px-3" />

                                                </div>
                                            </li>
                                            <li>
                                                <span className="text-sm font-medium text-gray-400">
                                                    Right
                                                </span>
                                                <div className="flex items-center justify-center gap-2">
                                                    <input
                                                        type="number"
                                                        className="h-10 w-full border border-gray-300 rounded-lg focus-visible:outline-none px-3" />

                                                </div>
                                            </li>
                                            <li>
                                                <span className="text-sm font-medium text-gray-400">
                                                    Bottom
                                                </span>
                                                <div className="flex items-center justify-center gap-2">
                                                    <input
                                                        type="number"
                                                        className="h-10 w-full border border-gray-300 rounded-lg focus-visible:outline-none px-3" />

                                                </div>
                                            </li>
                                            <li>
                                                <span className="text-sm font-medium text-gray-400">
                                                    Left
                                                </span>
                                                <div className="flex items-center justify-center gap-2">
                                                    <input
                                                        type="number"
                                                        className="h-10 w-full border border-gray-300 rounded-lg focus-visible:outline-none px-3" />

                                                </div>
                                            </li>
                                        </ul>
                                    </details>
                                    {/* BORDER */}
                                    <details className="group w-full  [&_summary::-webkit-details-marker]:hidden">
                                        <summary
                                            className="flex cursor-pointer w-full items-center justify-between gap-1.5 rounded-lg bg-white p-4 text-gray-900"
                                        >
                                            <span className="font-semibold text-gray-800 capitalize">Border</span>
                                            <svg
                                                className="size-5 shrink-0 transition duration-300 group-open:-rotate-180"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </summary>

                                        <ul className="grid grid-cols-2 gap-3 w-full mt-2 p-4 bg-white shadow-lg rounded-b-xl">
                                            <li>
                                                <span className="text-sm font-medium text-gray-400">
                                                    Top
                                                </span>
                                                <div className="flex items-center justify-center gap-2">
                                                    <input
                                                        type="number"
                                                        className="h-10 w-full border border-gray-300 rounded-lg focus-visible:outline-none px-3" />

                                                </div>
                                            </li>
                                            <li>
                                                <span className="text-sm font-medium text-gray-400">
                                                    Right
                                                </span>
                                                <div className="flex items-center justify-center gap-2">
                                                    <input
                                                        type="number"
                                                        className="h-10 w-full border border-gray-300 rounded-lg focus-visible:outline-none px-3" />

                                                </div>
                                            </li>
                                            <li>
                                                <span className="text-sm font-medium text-gray-400">
                                                    Bottom
                                                </span>
                                                <div className="flex items-center justify-center gap-2">
                                                    <input
                                                        type="number"
                                                        className="h-10 w-full border border-gray-300 rounded-lg focus-visible:outline-none px-3" />

                                                </div>
                                            </li>
                                            <li>
                                                <span className="text-sm font-medium text-gray-400">
                                                    Left
                                                </span>
                                                <div className="flex items-center justify-center gap-2">
                                                    <input
                                                        type="number"
                                                        className="h-10 w-full border border-gray-300 rounded-lg focus-visible:outline-none px-3" />

                                                </div>
                                            </li>
                                        </ul>
                                    </details>
                                    {/* BORDER RADIUS */}
                                    <details className="group w-full  [&_summary::-webkit-details-marker]:hidden">
                                        <summary
                                            className="flex cursor-pointer w-full items-center justify-between gap-1.5 rounded-lg bg-white p-4 text-gray-900"
                                        >
                                            <span className="font-semibold text-gray-800 capitalize">Radius</span>
                                            <svg
                                                className="size-5 shrink-0 transition duration-300 group-open:-rotate-180"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </summary>
                                        <ul className="grid grid-cols-2 gap-3 w-full mt-2 p-4 bg-white shadow-lg rounded-b-xl">
                                            <li>
                                                <span className="text-sm font-medium text-gray-400">
                                                    Top Left
                                                </span>
                                                <div className="flex items-center justify-center gap-2">
                                                    <input
                                                        type="number"
                                                        className="h-10 w-full border border-gray-300 rounded-lg focus-visible:outline-none px-3" />
                                                </div>
                                            </li>
                                            <li>
                                                <span className="text-sm font-medium text-gray-400">
                                                    Top Right
                                                </span>
                                                <div className="flex items-center justify-center gap-2">
                                                    <input
                                                        type="number"
                                                        className="h-10 w-full border border-gray-300 rounded-lg focus-visible:outline-none px-3" />
                                                </div>
                                            </li>
                                            <li>
                                                <span className="text-sm font-medium text-gray-400">
                                                    Bottom Right
                                                </span>
                                                <div className="flex items-center justify-center gap-2">
                                                    <input
                                                        type="number"
                                                        className="h-10 w-full border border-gray-300 rounded-lg focus-visible:outline-none px-3" />
                                                </div>
                                            </li>
                                            <li>
                                                <span className="text-sm font-medium text-gray-400">
                                                    Bottom Left
                                                </span>
                                                <div className="flex items-center justify-center gap-2">
                                                    <input
                                                        type="number"
                                                        className="h-10 w-full border border-gray-300 rounded-lg focus-visible:outline-none px-3" />
                                                </div>
                                            </li>
                                        </ul>
                                    </details>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            )}
        </>
    );
};

export default PropertiesBar;
