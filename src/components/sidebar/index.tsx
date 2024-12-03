import React, {useEffect, useState} from "react";
import Draggable from "../drangable";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import {v4} from "uuid";
import {io} from "socket.io-client";
import {formatText, serializeFromJsonToString} from "../../utilities/text";
import {Icon} from "@iconify/react/dist/iconify.js";
import {getPastelColor} from "../../utilities/colors";
import {DndContext, useDroppable} from "@dnd-kit/core";
import {ToastError, ToastSuccess} from "../toast";
import {cacheDataToIndexedDB} from "../../services/indexedDB/services";
import {setData, setSidebar} from "../../store/DndSlice";
import {GetData} from "../../apis";
import {DecryptBasic} from "../../utilities/hash_aes";
import {GetACookie} from "../../utilities/cookies";
import {Enum} from "../../config/common";
// import { Tooltip } from "@nextui-org/tooltip";

const Sidebar = () => {
  const sidebar = useSelector((state: RootState) => state.dndSlice.sidebar);
  const {data} = useSelector((state: RootState) => state.dndSlice);
  const dispatch = useDispatch();

  const [modal, setModal] = useState(false);

  // function store data to indexedDB
  const handleStoreDataToStorageAndState = (propsData: any) => {
    const serializedData = serializeFromJsonToString(propsData);
    cacheDataToIndexedDB(serializedData, "doc_1");
  };

  const handleFile = (file: File) => {
    if (file && file.type === "application/json") {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsedData = JSON.parse(e.target?.result as string);
          dispatch(setData(parsedData));
          if (parsedData?.childs.length > 0) {
            handleStoreDataToStorageAndState(parsedData);
          }
          ToastSuccess({msg: "File imported successfully!"});
          setModal(false);
        } catch (error) {
          ToastError({msg: "Invalid JSON file"});
        }
      };
      reader.readAsText(file);
    } else {
      ToastError({msg: "Please upload a valid JSON file"});
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    handleFile(file);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) handleFile(file);
  };

  const getSlicesData = async () => {
    try {
      const response = (await GetData(
        `${import.meta.env.VITE__API_HOST}/api/slices?pId=${DecryptBasic(
          GetACookie("pid"),
          Enum.srkey
        )}&dId=${DecryptBasic(GetACookie("did"), Enum.srkey)}`
      )) as any;
      if (response) {
        return response?.map((item: any) => ({
          ...item,
          id: item?.sliceId,
          columns: "1",
          rows: "1",
          colspan: "1",
          rowspan: "1",
          gap: "1",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          type: "content",
          childs: [],
          style: {},
          thumbnail: item?.thumbnailUrl || "",
        }));
      }
    } catch (error) {
      //
    }
  };
  const getDocumentsData = async () => {
    try {
      const response = (await GetData(
        `${import.meta.env.VITE__API_HOST}/api/documents?dId=${DecryptBasic(
          GetACookie("did"),
          Enum.srkey
        )}`
      )) as any;
      if (response) {
        return response[0]?.layoutJson[0]?.data;
      }
    } catch (error) {
      //
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = await getSlicesData();
      dispatch(setSidebar(result));
      const documentResult = await getDocumentsData();

      if (documentResult) {
        dispatch(setData(JSON.parse(documentResult)));
        console.log(JSON.parse(documentResult));
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const socket = io(
      "https://serverless-tn-layout-production.up.railway.app",
      {
        withCredentials: true,
        transports: ["websocket"],
      }
    );

    socket.on("webhook-data", async (data) => {
      const result = await getSlicesData();
      dispatch(setSidebar(result));
      const documentResult = await getDocumentsData();
      dispatch(setData(JSON.parse(documentResult)));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <div className="h-[calc(100vh)] w-full sticky top-4 rounded-r-xl flex-col gap-12 flex  bg-gray-100 rounded-lg p-6 max-w-[25rem] z-50 items-center ">
      {modal && (
        <div
          className="flex items-center justify-center top-0 left-0 animate-fade fixed z-[900] w-screen h-screen bg-black/30"
          onClick={() => setModal(false)}>
          <div
            className="p-6 bg-white rounded-2xl w-full max-w-96 aspect-video animate-delay-200 animate-fade-up"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between font-semibold">
              Import
              <Icon
                icon="ph:x-light"
                className="cursor-pointer"
                fontSize={24}
                onClick={() => setModal(false)}
              />
            </div>
            <DndContext
              onDragEnd={event => {
                const file = event.active.data.current as File | undefined;
                if (file) handleFile(file);
              }}>
              <div
                onDragOver={e => e.preventDefault()}
                onDrop={handleDrop}
                className={`h-full flex flex-col items-center relative justify-center mt-6 border-dashed border  rounded-lg min-h-40 w-full bg-slate-100 before:absolute overflow-hidden before:h-full before:content[] before:aspect-square before:rounded-full before:bg-white/40 before:z-[1]`}>
                <div className="w-full relative h-full flex flex-col justify-center items-center z-[2]">
                  <span className="text-slate-500">Drop JSON here</span>
                  <span className="text-slate-500 text-sm">or</span>
                  <label
                    htmlFor="import-json-field"
                    className="mt-2 bg-white cursor-pointer select-none px-4 py-2 border rounded-xl hover:bg-cyan-100 transition-all duration-500">
                    Browse
                    <input
                      onChange={handleInputChange}
                      type="file"
                      id="import-json-field"
                      hidden
                      accept=".json"
                    />
                  </label>
                </div>
              </div>
            </DndContext>
          </div>
        </div>
      )}
      <div className="mx-auto w-full font-bold text-3xl flex items-center justify-between">
        <span>Elements</span>
        <div
          onClick={() => setModal(true)}
          className="px-5 hover:bg-gray-500 transition-all duration-500 cursor-pointer h-10 rounded-full text-base font-normal bg-gray-700 text-white flex items-center justify-center">
          Import
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 px-4 w-full">
        <Draggable
          className="w-full h-16 col-span-1 bg-[#444] text-white flex items-center justify-center rounded-xl"
          columns="1"
          rows="1"
          type="grid"
          colspan="1"
          rowspan="1"
          alignItems="flex-start"
          justifyContent="flex-start"
          gap="1"
          id={v4()}
          thumbnail="_">
          <div className="flex gap-2 justify-center items-center">
            <Icon icon="ph:columns" fontSize={28} />
            <div className="rounded-xl text-center truncate text-sm">
              Grid Layout
            </div>
          </div>
        </Draggable>
        <Draggable
          className="w-full h-16 bg-[#444] text-white flex items-center justify-center rounded-xl"
          columns="1"
          rows="1"
          type="flex"
          colspan="1"
          rowspan="1"
          alignItems="flex-start"
          justifyContent="flex-start"
          gap="1"
          id={v4()}
          thumbnail="_">
          <div className="flex gap-2 justify-center items-center p-7">
            <Icon icon="ph:square" fontSize={28} />
            <div className="rounded-xl text-center text-sm truncate">
              Box Layout
            </div>
          </div>
        </Draggable>
      </div>
      <div className="px-4 w-full gap-2 grid grid-cols-4 ">
        {sidebar.map((item, index) => (
          <Draggable
            styling={{ backgroundColor: getPastelColor(index, 4) }}
            className="col-span-1 w-full h-16 text-white flex items-center justify-center rounded-xl"
            {...item}
            key={index}
            id={item.id}>
            <div
              title={formatText(item.id)}
              className="p-2 rounded-xl text-center text-sm truncate line-clamp-2">
              {formatText("" + item.id)}
            </div>
            {/* NextUI Tooltip */}
            {/* <Tooltip
              content={
                item.thumbnailUrl ? (
                  <img
                    src={item.thumbnailUrl}
                    alt="Thumbnail"
                    className="w-32 h-32"
                  />
                ) : (
                  "No image available"
                )
              }
              placement="top">
              <div className="w-full h-full"></div>
            </Tooltip> */}
          </Draggable>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
