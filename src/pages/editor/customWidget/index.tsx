import Sidebar from "../../../components/sidebar";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import MonacoEditor from "../../../components/monacoEditor";
import {
  setDataCustomWidget,
  setListWidgetElements,
} from "../../../store/DndWidget";
import _ from "lodash";
import axios from "axios";
import { ToastSuccess } from "../../../components/toast";
import { DecryptBasic } from "../../../utilities/hash_aes";
import { Enum } from "../../../config/common";
import { GetACookie } from "../../../utilities/cookies";
import { useEffect } from "react";
import { defaultContent } from "./const";

function toSnakeCase(str) {
  return str.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();
}

const CustomWidget = () => {
  const projectId = DecryptBasic(GetACookie("pid"), Enum.srkey);

  const [{ dataCustomWidget }, { activeCreateFunction }] = useSelector(
    (state: RootState) => [state.dndWidgets, state.dndSlice],
    shallowEqual
  );

  const dispatch = useDispatch();

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
    try {
      const respon = await axios.post(
        `${
          import.meta.env.VITE__API_HOST
        }/api/elements/pushFileELementToGitHub`,
        {
          repoName: "prismic-test-160",
          fileName: dataCustomWidget.name,
          fileContent: dataCustomWidget.data,
          projectId,
        }
      );
      if (respon.status === 201) {
        ToastSuccess({ msg: "Created new widget!" });
      }
    } catch (error) {}
  };

  const getWidgetElements = async () => {
    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE__API_HOST
        }/api/elements/widgetElements?projectId=${projectId}`
      );
      console.log("res", res.data.data);
      dispatch(setListWidgetElements(res.data.data));
    } catch (error) {}
  };

  const renderSidebar = !activeCreateFunction && <Sidebar />;

  useEffect(() => {
    getWidgetElements();
  }, []);

  return (
    <div className="flex">
      {renderSidebar}
      <div className="w-full">
        <div className="flex gap-12 justify-between px-4">
          <div className="pb-2 ">
            <div className="flex flex-col items-start justify-start p-2 gap-1.5">
              <span className="text-sm font-medium text-gray-700">
                Widget Name
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
              className="border p-2 rounded-lg text-[#c3c3c3] font-semibold hover:bg-gray-800"
              onClick={onSaveWidget}
            >
              Save Widget
            </button>
          </div>
        </div>
        <MonacoEditor
          data={_.get(dataCustomWidget, "data")}
          defaultCode={defaultContent}
          handleEditorChange={handleEditorChange}
        />
      </div>
    </div>
  );
};

export default CustomWidget;
