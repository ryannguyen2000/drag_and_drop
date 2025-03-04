import React, { memo, useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import Sidebar from "../../../components/sidebar";
import SandpackEditor from "../../../components/sandpack";
import _ from "lodash";
import axiosInstance from "../../../apis/axiosInstance";
import { ToastSuccess } from "../../../components/toast";
import EnvConfig from "./envConfig";
import { DecryptBasic } from "../../../utilities/hash_aes";
import { GetACookie } from "../../../utilities/cookies";
import { Enum } from "../../../config/common";
import LibraryManager, { DEFAULT_LIBRARIES } from "./libraryManager";
import { Icon } from "@iconify/react/dist/iconify.js";
import {
  setDataPackage,
  setDataTailwind,
} from "../../../store/sandpackSetting";
import { getDataSandpackSetting } from "../../../apis/commons";

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
  const [
    { dataCustomWidget },
    { dataEnv, activeFileSetting, dataTailwind, dataPackage, selectedLibs },
  ] = useSelector(
    (state: RootState) => [state.dndWidgets, state.sandpackSetting],
    shallowEqual
  );

  const [loadingSave, setLoadingSave] = useState<boolean>(false);

  const renderSidebar = <Sidebar />;

  const onSave = async () => {
    setLoadingSave(true);

    const newSelectedLibs = DEFAULT_LIBRARIES.filter((lib) =>
      selectedLibs.includes(lib.name)
    ) // Lọc thư viện có trong danh sách cần lấy
      .reduce((acc, lib) => {
        acc[lib.name] = lib.version; // Chuyển thành object { 'shadcn/ui': "latest", ... }
        return acc;
      }, {});

    let convertContent = JSON.parse(dataPackage);
    if (!_.isEmpty(convertContent)) {
      convertContent.dependencies = {
        ...convertContent.dependencies,
        ...newSelectedLibs,
      };
    }

    try {
      const urls = {
        env: "env",
        tailwind: "tailwind",
        package: "package",
      };

      const bodyReq = {
        env: {
          projectId,
          envs: dataEnv,
        },
        tailwind: {
          projectId,
          content: dataTailwind,
        },
        package: {
          projectId,
          content: !_.isEmpty(convertContent) && convertContent,
        },
      };

      const respon = await axiosInstance.put(
        `/${urls[activeFileSetting]}`,
        bodyReq[activeFileSetting]
      );
      if (respon.status === 200) {
        await getDataSandpackSetting({ dispatch, projectId });
        ToastSuccess({ msg: "Upload successfully!" });
      }
    } catch (error) {
      console.log("ERROR 🚀", error);
    }
    setLoadingSave(false);
  };

  const isCustomEnv = activeFileSetting === "env";
  const isPackage = activeFileSetting === "package";

  const handleEditorChange = (value: any) => {
    dispatch(isPackage ? setDataPackage(value) : setDataTailwind(value));
  };

  const renderEditorBody = isCustomEnv ? (
    <EnvConfig />
  ) : (
    <SandpackEditor
      data={_.get(dataCustomWidget, "data", "")}
      handleEditorChange={handleEditorChange}
      fileNameShow={isPackage ? "/package.json" : "/tailwind.config.ts"}
    />
  );

  return (
    <div className="w-full">
      <div className="flex gap-12 justify-between px-4">
        <div className="pb-2 ">
          <div className="flex flex-col items-start justify-start py-2 gap-1.5">
            <span className="text-sm font-medium text-gray-700">
              Widget Name
            </span>
            <textarea
              disabled={true}
              // value={activeWidgetId}
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
            onClick={onSave}
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
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>
      <div className="flex px-[1rem]">
        {renderEditorBody}
        {isPackage && <LibraryManager onDependenciesChange={() => {}} />}
      </div>
    </div>
  );
};

export default memo(Setting);
