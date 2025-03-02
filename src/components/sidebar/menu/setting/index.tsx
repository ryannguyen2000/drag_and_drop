import _ from "lodash";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { getTailwindConfig, getWidgetElements } from "../../../../apis/commons";
import { setActiveWidgetId, setDataEnv } from "../../../../store/DndWidget";
import axiosInstance from "../../../../apis/axiosInstance";

const items = [
  {
    label: "Tailwind.config.ts",
    value: "tailwindConfig",
  },
  {
    label: ".env",
    value: "env",
  },
];

const Setting = ({ projectId, ...props }) => {
  const dispatch = useDispatch();

  const getEnv = async () => {
    try {
      const res = await axiosInstance.get(`env`, {
        params: {
          projectId,
        },
      });
      dispatch(setDataEnv(_.get(res, "data.data.envs", [])));
    } catch (error) {}
  };

  const getDataTailwindConfig = async (value: string) => {
    if (value === "env") {
      await getEnv();
    } else {
      await getTailwindConfig({ targetRepo: "project_1", dispatch });
    }
    dispatch(setActiveWidgetId(value));
  };

  return (
    <div className="flex gap-12 flex-col w-full h-full">
      <div className="gap-2 flex flex-col">
        {_.map(items, (i) => (
          <button
            key={i.value}
            onClick={() => getDataTailwindConfig(i.value)}
            className="p-4 rounded-xl flex justify-start items-center border-[0.5px] w-[180px] hover:bg-slate-700 focus:border-blue-400"
          >
            <div className="text-center text-sm truncate line-clamp-2">
              {i.label}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Setting;
