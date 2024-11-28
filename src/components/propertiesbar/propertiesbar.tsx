import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Obj, setActiveData, setData, setThumnail } from "../../store/DndSlice";
import { RootState } from "../../store";
import exportFromJSON from "export-from-json";
import axios from "axios";
import { ToastDismiss, ToastError, ToastSuccess } from "../toast";
import { Icon } from "@iconify/react/dist/iconify.js";
import { serializeFromJsonToString } from "../../utilities/text";
import {
  cacheDataToIndexedDB,
  getCachedDataFromIndexedDB,
} from "../../services/indexedDB/services";
import { saveDocument } from "../../services/documents/api";
import { transformData } from "../../utilities/formatData";
import { DecryptBasic } from "../../utilities/hash_aes";
import { GetACookie } from "../../utilities/cookies";
import { Enum } from "../../config/common";

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
  const { activeData, activeId, data, thumnail } = useSelector(
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
  const [styles, setStyles] = useState<React.CSSProperties>(activeData?.style);

  const [backGroundtype, setBackgroundType] = useState<"image" | "color">(
    "color"
  );
  const [modalBackground, setModalBackground] = useState<boolean>(false);
  const [imagePreview, setThumnailPreview] = useState<string | null>(null);

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
        childs.map(child => {
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
            console.log("activeDATA", child);
          }
          if (child.childs) {
            getDetail(child.childs);
          }
        });
      };
      getDetail(data.childs);
    }
  }, [activeId]);

  // function store data to indexedDB
  const handleStoreDataToStorageAndState = (propsData: any) => {
    const serializedData = serializeFromJsonToString(propsData);
    cacheDataToIndexedDB(serializedData, "doc_1");
  };

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
          thumnail: thumnail,
        })
      );
      return;
    }

    function RefactorData(child: Obj[]): Obj[] {
      return child.map(item => {
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
            thumnail: thumnail,
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

    const newData = { ...copyData, childs: updatedChilds };
    dispatch(setData(newData));
    if (newData?.childs?.length > 0) {
      handleStoreDataToStorageAndState({ ...copyData, childs: updatedChilds });
    }
  };

  useEffect(() => {
    SetPropertyJson(activeId);
  }, [
    colspan,
    rowspan,
    columns,
    rows,
    gap,
    justifyContent,
    alignItems,
    styles,
    thumnail,
  ]);

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
      setStyles(prevStyles => {
        const newStyles = { ...prevStyles };
        delete newStyles[property]; // Xóa thuộc tính nếu giá trị là 0
        return newStyles;
      });
    } else {
      setStyles(prevStyles => ({
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
    setStyles(prevStyles => {
      const paddingValues = (prevStyles?.padding || "0px 0px 0px 0px")
        .toString() // Đảm bảo là chuỗi
        .split(" "); // Chuyển thành mảng

      const directionIndex = { top: 0, right: 1, bottom: 2, left: 3 }[
        direction
      ]; // Lấy vị trí
      paddingValues[directionIndex] = `${value}${unit}`; // Cập nhật giá trị kèm unit

      const newPadding = paddingValues.join(" "); // Gộp lại thành chuỗi

      // Kiểm tra nếu tất cả các giá trị là 0
      if (
        paddingValues.every(
          val =>
            val === "0px" || val === "0rem" || val === "0em" || val === "0%"
        )
      ) {
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
    setStyles(prevStyles => {
      const marginValues = (prevStyles?.margin || "0px 0px 0px 0px")
        .toString() // Đảm bảo là chuỗi
        .split(" "); // Chuyển thành mảng

      const directionIndex = { top: 0, right: 1, bottom: 2, left: 3 }[
        direction
      ]; // Lấy vị trí
      marginValues[directionIndex] = `${value}${unit}`; // Cập nhật giá trị kèm unit

      const newMargin = marginValues.join(" "); // Gộp lại thành chuỗi

      // Kiểm tra nếu tất cả các giá trị là 0
      if (
        marginValues.every(
          val =>
            val === "0px" || val === "0rem" || val === "0em" || val === "0%"
        )
      ) {
        const { margin, ...rest } = prevStyles; // Loại bỏ margin nếu tất cả giá trị là 0
        return rest;
      }

      return { ...prevStyles, margin: newMargin }; // Cập nhật margin nếu không phải 0
    });
  };

  const handleBackgroundColorChange = newColor => {
    if (!newColor.startsWith("#")) {
      newColor = `#${newColor}`;
    }
    setStyles(prevStyles => {
      const updatedStyles = { ...prevStyles };
      delete updatedStyles.backgroundImage; // Xóa hình ảnh
      updatedStyles.backgroundColor = newColor; // Thêm màu mới
      return updatedStyles;
    });
  };

  const [backgroundImage, setBackgroundImage] = useState(
    "https://via.placeholder.com/300x200"
  );
  const handleBackgroundImageChange = newImage => {
    setBackgroundImage(newImage);
    setStyles(prevStyles => {
      const updatedStyles = { ...prevStyles };
      delete updatedStyles.backgroundColor; // Xóa màu nền
      updatedStyles.backgroundImage = `url(${newImage})`; // Thêm hình ảnh mới
      return updatedStyles;
    });
  };

  const handleStyleChange = (property, value) => {
    setStyles(prevStyles => ({
      ...prevStyles,
      [property]: value,
    }));
  };

  const handleBorderChange = (
    value: string | number,
    property: "width" | "style" | "color",
    unit?: string
  ) => {
    setStyles(prevStyles => {
      const newStyles = { ...prevStyles };

      // Khởi tạo border nếu chưa tồn tại
      if (!newStyles?.border) {
        newStyles.border = "none"; // Giá trị mặc định
      }

      // Kiểm tra nếu border là chuỗi, nếu không thì chuyển thành chuỗi
      const borderParts =
        typeof newStyles?.border === "string"
          ? newStyles?.border.split(" ")
          : ["0px", "solid", "black"];

      if (property === "width") {
        borderParts[0] = `${value}${unit || "px"}`; // Cập nhật width
      } else if (property === "style") {
        borderParts[1] = value as string; // Cập nhật style
      } else if (property === "color") {
        borderParts[2] = value as string; // Cập nhật color
      }

      // Cập nhật lại chuỗi border
      newStyles.border = borderParts.join(" ");

      return newStyles;
    });
  };

  const handleBorderRadiusChange = (
    value: string | number,
    corner:
      | "borderTopLeftRadius"
      | "borderTopRightRadius"
      | "borderBottomLeftRadius"
      | "borderBottomRightRadius",
    unit: string
  ) => {
    if (value === 0 || value === "0") {
      // Nếu giá trị là 0, xóa thuộc tính tương ứng
      setStyles(prevStyles => {
        const newStyles = { ...prevStyles };
        delete newStyles[corner];
        return newStyles;
      });
    } else {
      // Cập nhật giá trị của góc nếu giá trị khác 0
      setStyles(prevStyles => ({
        ...prevStyles,
        [corner]: `${value}${unit}`,
      }));
    }
  };

  useEffect(() => {
    if (styles) {
      console.log("🚀 ~ useEffect ~ styles:", styles);
    }
  }, [styles]);

  const handleDownloadAsJson = () => {
    const fileName = "JsonLayout";
    const exportType = exportFromJSON.types.json;

    exportFromJSON({ data, fileName, exportType });
  };

  const handlePublishJsonData = async () => {
    const documentData = {
      projectId: DecryptBasic(GetACookie("pid"), Enum.srkey),
      documentId: DecryptBasic(GetACookie("did"), Enum.srkey),
      layoutJson: data,
      documentName: "_",
      thumnail: "_",
    };
    try {
      const finalData = transformData(
        data,
        DecryptBasic(GetACookie("pid"), Enum.srkey),
        DecryptBasic(GetACookie("did"), Enum.srkey)
      );
      if (finalData) {
        const saveResponse = await axios.post(
          "https://serverless-tn-layout-production.up.railway.app/api/slices",
          finalData
        );
        const saveDocResponse = await axios.post(
          "https://serverless-tn-layout-production.up.railway.app/api/documents",
          documentData
        );
        if (saveDocResponse.status === 200 || saveDocResponse.status === 201) {
          console.log(saveDocResponse);
        }
        if (saveResponse.status === 200 || saveResponse.status === 201) {
          const response = await axios.post(
            "https://serverless-tn-layout-production.up.railway.app/publish",
            data
          );
          if (response.status === 200 || response.status === 201) {
            ToastSuccess({ msg: "Published successfully" });
          } else {
            ToastError({
              msg: "Oops! Something went wrong to available publish",
            });
          }
        }
      }
    } catch (error) {
      //
    }

    // Save document to DB
    const layoutJSON = await getCachedDataFromIndexedDB("doc_1");
    const payload = {
      projectId: "lalala-layout-test-sifo#950slfk@",
      documentId: "docio3#98204ksf8",
      documentName: "Lalala Prismic Test",
      layoutJson: layoutJSON ? layoutJSON[0]?.data : {},
    };
    await saveDocument(payload);
  };

  useEffect(() => {
    if (activeId) {
      const findActiveData = (data: Obj): Obj | null => {
        if (data.id === activeId) return data;
        if (data.childs) {
          for (const child of data.childs) {
            const found = findActiveData(child);
            if (found) return found;
          }
        }
        return null;
      };
      const currentActiveData = findActiveData(data);
      if (currentActiveData) {
        dispatch(setActiveData(currentActiveData));
        // setThumnailPreview(currentActiveData.thumnail || null);
      }
    }
  }, [activeId, data, dispatch]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      ToastError({ msg: "Please upload a valid image file." });
      return;
    }

    if (activeId) {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Image = reader.result as string;

        // Upload ảnh lên server
        const uploadedImageUrl = await uploadImageToServer(base64Image);

        if (uploadedImageUrl) {
          dispatch(setThumnail(uploadedImageUrl));
          setThumnailPreview(uploadedImageUrl);
          ToastDismiss();
          ToastSuccess({ msg: "Image uploaded successfully!" });

          e.target.value = "";
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (!activeId || !activeData) {
    return null;
  }

  const uploadImageToServer = async (
    base64Image: string
  ): Promise<string | null> => {
    try {
      const response = await axios.post(
        "https://serverless-tn-layout-production.up.railway.app/api/upload",
        { image: base64Image },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Server Response:", response.data);

      if (response.status === 200 || response.status === 201) {
        // ToastSuccess({ msg: "Upload successfully!" });

        return response.data?.imageUrl;
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      ToastError({ msg: "Error uploading image to server." });
      return null;
    }
  };

  return (
    <>
      {activeId && (
        <div className="h-[calc(100vh)] w-full animate-fade-left animate-duration-500 sticky top-4 right-0 rounded-l-xl flex-col flex items-center bg-gray-100 rounded-lg p-6 max-w-96 z-20 before:absolute before:content[] before:rounded-full before:w-full before:aspect-square before:bg-white before:z-0 before:-translate-y-[57%] overflow-scroll">
          <div className="flex items-center justify-center gap-4 h-fit z-10">
            <button
              onClick={() => handleDownloadAsJson()}
              className="h-10 aspect-square group hover:px-3 flex items-center hover:bg-slate-500 transition-all duration-500 justify-center w-10 hover:w-full  text-sm bg-[#444] text-white rounded-full">
              <Icon icon="ph:arrow-line-down" fontSize={20} />
              <span className="text-nowrap opacity-0 select-none ml-0 group-hover:ml-2 pointer-events-none group-hover:opacity-100 w-0 group-hover:w-full transition-all duration-500">
                Download as JSON
              </span>
            </button>
            <button
              onClick={() => handlePublishJsonData()}
              className="h-10 px-4  text-sm bg-[#444] text-white rounded-full">
              Publish
            </button>
          </div>
          <span className="mx-auto w-full text-center font-semibold text-gray-500 capitalize text-normal  z-10 mt-12">
            Properties of
          </span>

          {isLayout === "content" && (
            <span
              className={`animate-fade-up w-full text-center font-semibold text-3xl capitalize px-4 py-2 z-10`}>
              {isLayout}
            </span>
          )}
          {isLayout === "grid" && (
            <span
              className={`animate-fade-up w-full text-center font-semibold text-3xl capitalize px-4 py-2 z-10`}>
              {isLayout + " layout"}
            </span>
          )}
          {isLayout === "flex" && (
            <span
              className={`animate-fade-up w-full text-center font-semibold text-3xl capitalize px-4 py-2 z-10`}>
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
                <div className="flex flex-col items-start mt-3 animate-fade-up z-[50]">
                  <span className="text-sm font-medium text-gray-400">
                    Justify Content
                  </span>
                  <div
                    className={`h-10 relative w-full border border-gray-300  rounded-lg flex-col px-3 py-2 bg-white`}
                    onClick={() =>
                      setJustifyShow(prev => {
                        !prev === true && setAlignShow(false);
                        return !prev;
                      })
                    }>
                    <span>{justifyContent}</span>
                    <div
                      className={`flex-col rounded-xl absolute w-full left-0 shadow-xl top-full bg-white  overflow-hidden ${
                        justifyShow ? "flex" : "hidden"
                      }`}>
                      {justifyList.map((item, index) => (
                        <span
                          key={index}
                          className={`w-full hover:bg-slate-100 transition-all duration-500 cursor-pointer px-4 py-2 ${
                            justifyContent === item.title && "bg-slate-100"
                          }`}
                          onClick={() =>
                            handleJustifyContentChange(item.title)
                          }>
                          {item.title}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {isLayout === "flex" && (
                <div className="flex flex-col items-start mt-3 animate-fade-up z-[50]">
                  <span className="text-sm font-medium text-gray-400">
                    Align Items
                  </span>
                  <div
                    className={`h-10 relative w-full border border-gray-300 rounded-lg flex-col px-3 py-2 bg-white `}
                    onClick={() =>
                      setAlignShow(prev => {
                        !prev === true && setJustifyShow(false);
                        return !prev;
                      })
                    }>
                    <span>{alignItems}</span>
                    <div
                      className={`flex-col rounded-xl absolute top-full shadow-xl w-full left-0 bg-white overflow-hidden ${
                        alignShow ? "flex" : "hidden"
                      }`}>
                      {alignList.map((item, index) => (
                        <span
                          key={index}
                          className={`w-full hover:bg-slate-100 transition-all duration-500 cursor-pointer px-4 py-2 ${
                            alignItems === item.title && "bg-slate-100"
                          }`}
                          onClick={() => handleAlignItemsChange(item.title)}>
                          {item.title}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-col mb-4">
              <label className="text-sm font-medium text-gray-400">
                Upload Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="h-10 w-full border rounded-lg px-3 mt-2"
              />
              {!imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              )}
              {imagePreview && activeData.thumnail && (
                <div className="mt-2">
                  <img
                    src={activeData.thumnail}
                    alt="Preview"
                    className="w-full h-auto rounded-lg"
                  />
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
