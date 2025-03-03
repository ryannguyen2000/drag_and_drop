import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";

import axiosInstance from "../../../../apis/axiosInstance";
import { RootState } from "../../../../store";
import {
  setActiveFileSetting,
  setDataEnv,
} from "../../../../store/sandpackSetting";

const items = [
  {
    label: "Tailwind.config.ts",
    value: "tailwind",
  },
  {
    label: ".env",
    value: "env",
  },
  {
    label: "package.json",
    value: "package",
  },
];

const Setting = ({ projectId, ...props }) => {
  const dispatch = useDispatch();

  const { activeWidgetId } = useSelector(
    (state: RootState) => state.dndWidgets
  );

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

  const getData = async (path: string) => {
    if (path === "env") {
      await getEnv();
    }
    dispatch(setActiveFileSetting(path));
  };

  return (
    <div className="flex gap-12 flex-col w-full h-full">
      <div className="gap-2 flex flex-col">
        {_.map(items, (i) => {
          const isActive = activeWidgetId === i.value;
          return (
            <button
              key={i.value}
              onClick={() => getData(i.value)}
              className={`p-4 rounded-xl flex justify-start items-center border-[0.5px] w-[180px] hover:bg-slate-700 ${
                isActive ? "border-blue-400" : ""
              } `}
            >
              <div className="text-center text-sm truncate line-clamp-2">
                {i.label}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Setting;
