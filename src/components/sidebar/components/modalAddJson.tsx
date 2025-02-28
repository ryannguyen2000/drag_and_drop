import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { DndContext } from "@dnd-kit/core";
import { useDispatch } from "react-redux";
import { setData } from "../../../store/DndSlice";
import { serializeFromJsonToString } from "../../../utilities/text";
import { cacheDataToIndexedDB } from "../../../services/indexedDB/services";
import { ToastError, ToastSuccess } from "../../toast";

const ModalAddJson = ({ modal, setModal }) => {
  const dispatch = useDispatch();

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
          ToastSuccess({ msg: "File imported successfully!" });
          setModal(false);
        } catch (error) {
          ToastError({ msg: "Invalid JSON file" });
        }
      };
      reader.readAsText(file);
    } else {
      ToastError({ msg: "Please upload a valid JSON file" });
    }
  };

  // function store data to indexedDB
  const handleStoreDataToStorageAndState = (propsData: any) => {
    const serializedData = serializeFromJsonToString(propsData);
    cacheDataToIndexedDB(serializedData, "doc_1");
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

  return (
    <>
      {modal && (
        <div
          className="flex items-center justify-center top-0 left-0 animate-fade fixed z-[900] w-screen h-screen bg-black/30"
          onClick={() => setModal(false)}
        >
          <div
            className="p-6 bg-white rounded-2xl w-full max-w-96 aspect-video animate-delay-200 animate-fade-up"
            onClick={(e) => e.stopPropagation()}
          >
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
              onDragEnd={(event) => {
                const file = event.active.data.current as File | undefined;
                if (file) handleFile(file);
              }}
            >
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="h-full flex flex-col items-center relative justify-center mt-6 border-dashed border rounded-lg min-h-40 w-full bg-slate-100 before:absolute overflow-hidden before:h-full before:content[] before:aspect-square before:rounded-full before:bg-white/40 before:z-[1]"
              >
                <div className="w-full relative h-full flex flex-col justify-center items-center z-[2]">
                  <span className="text-slate-500">Drop JSON here</span>
                  <span className="text-slate-500 text-sm">or</span>
                  <label
                    htmlFor="import-json-field"
                    className="mt-2 bg-white cursor-pointer select-none px-4 py-2 border rounded-xl hover:bg-cyan-100 transition-all duration-500"
                  >
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
    </>
  );
};

export default ModalAddJson;
