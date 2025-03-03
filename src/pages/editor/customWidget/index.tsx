import Sidebar from "../../../components/sidebar";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { setDataCustomWidget } from "../../../store/DndWidget";
import _ from "lodash";
import axios from "axios";
import { ToastSuccess } from "../../../components/toast";
import { DecryptBasic } from "../../../utilities/hash_aes";
import { Enum } from "../../../config/common";
import { GetACookie } from "../../../utilities/cookies";
import { getWidgetElements } from "../../../apis/commons";
import SandpackEditor from "../../../components/sandpack";
import MonacoEditor from "../../../components/monacoEditor";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useState } from "react";

function toSnakeCase(str) {
  return str.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();
}

const CustomWidget = () => {
  const projectId = DecryptBasic(GetACookie("pid"), Enum.srkey);

  const [{ dataCustomWidget, activeWidgetId }, { activeCreateFunction }] =
    useSelector(
      (state: RootState) => [state.dndWidgets, state.dndSlice],
      shallowEqual
    );

  const dispatch = useDispatch();

  const [loadingSave, setLoadingSave] = useState<boolean>(false);

  const handleEditorChange = (value: any) => {
    console.log(value);

    dispatch(
      setDataCustomWidget({
        ...dataCustomWidget,
        data: value,
      })
    );
  };

  const handleChangeWidgetName = (value: any) => {
    dispatch(
      setDataCustomWidget({
        ...dataCustomWidget,
        name: value,
      })
    );
  };

  const onSaveWidget = async () => {
    setLoadingSave(true);
    try {
      const respon = await axios.post(
        `${
          import.meta.env.VITE__API_HOST
        }/api/elements/pushFileELementToGitHub`,
        {
          fileName: dataCustomWidget.name,
          fileContent: dataCustomWidget.data,
          projectId,
          value: toSnakeCase(dataCustomWidget.name),
        }
      );
      if (respon.status === 201) {
        ToastSuccess({ msg: "Created new widget!" });
        getWidgetElements({ projectId, dispatch });
      }
    } catch (error) {}
    setLoadingSave(false);
  };

  const renderSidebar = !activeCreateFunction && <Sidebar />;

  return (
    <div className="flex">
      {renderSidebar}
      <div className="w-full">
        <div className="flex gap-12 justify-between px-4">
          <div className="pb-2 ">
            <div className="flex flex-col items-start justify-start py-2 gap-1.5">
              <span className="text-sm font-medium text-gray-700">
                {activeWidgetId ? "Widget Name" : "New Widget Name"}
              </span>
              <textarea
                onChange={(e) => handleChangeWidgetName(e.target.value)}
                value={_.get(dataCustomWidget, "name")}
                placeholder={`Enter widget name`}
                className="w-[20rem] border border-gray-300 p-2 rounded"
                rows={1}
              />
            </div>
          </div>
          <div className="self-center">
            <button
              type="button"
              disabled={loadingSave}
              onClick={onSaveWidget}
              className={`${
                loadingSave && "pointer-events-none select-none"
              } w-fit rounded-xl border px-5 py-2.5 text-sm text-white shadow-sm transition-all duration-500 hover:bg-gray-700`}
            >
              {loadingSave ? (
                <Icon
                  icon="ph:circle-notch"
                  fontSize={16}
                  className="animate-spin"
                />
              ) : activeWidgetId ? (
                "Save Widget"
              ) : (
                "Save New Widget"
              )}
            </button>
          </div>
        </div>
        <div className="w-full px-[1rem]">
          <SandpackEditor
            data={_.get(dataCustomWidget, "data", "")}
            handleEditorChange={handleEditorChange}
            fileNameShow="/App.tsx"
          />
        </div>
      </div>
    </div>
  );
};

export default CustomWidget;
