import React from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import Sidebar from "../../../components/sidebar";
import SandpackEditor from "../../../components/sandpack";
import _ from "lodash";
import { setDataCustomWidget } from "../../../store/DndWidget";
import axiosInstance from "../../../apis/axiosInstance";
import { ToastSuccess } from "../../../components/toast";
import EnvConfig from "./envConfig";
import { DecryptBasic } from "../../../utilities/hash_aes";
import { GetACookie } from "../../../utilities/cookies";
import { Enum } from "../../../config/common";

const contentFake = `import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background1)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
} satisfies Config;`;

const Setting = () => {
  const projectId = DecryptBasic(GetACookie("pid"), Enum.srkey);

  const dispatch = useDispatch();
  const { dataCustomWidget, activeWidgetId, dataEnv } = useSelector(
    (state: RootState) => state.dndWidgets
  );

  const renderSidebar = <Sidebar />;

  const handleEditorChange = (value: any) => {
    dispatch(
      setDataCustomWidget({
        ...dataCustomWidget,
        data: value,
      })
    );
  };

  const onSaveWidget = async () => {
    try {
      const urls = {
        env: "env",
        tailwindConfig: "tailwindConfig",
      };

      const bodyReq = {
        env: {
          projectId,
          envs: dataEnv,
        },
        tailwindConfig: {
          targetRepo: "project_1",
          content: contentFake,
        },
      };

      const respon = await axiosInstance.put(
        `/${urls[activeWidgetId]}`,
        bodyReq[activeWidgetId]
      );
      if (respon.status === 200) {
        ToastSuccess({ msg: "Upload successfully!" });
      }
    } catch (error) {}
  };

  const isCustomEnv = activeWidgetId === "env";
  const renderEditorBody = isCustomEnv ? (
    <EnvConfig />
  ) : (
    <SandpackEditor
      data={_.get(dataCustomWidget, "data", "")}
      handleEditorChange={handleEditorChange}
    />
  );

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
              {/* <textarea
                onChange={(e) => handleChangeWidgetName(e.target.value)}
                value={_.get(dataCustomWidget, "name")}
                placeholder={`Enter widget name`}
                className="w-[20rem] border border-gray-300 p-2 rounded"
                rows={1}
              /> */}
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
        {renderEditorBody}
      </div>
    </div>
  );
};

export default Setting;
