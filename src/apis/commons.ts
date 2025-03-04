import _ from "lodash";
import {
  setDataCustomWidget,
  setDataElements,
  setListWidgetElements,
} from "../store/DndWidget";
import axiosInstance from "./axiosInstance";
import { setDataPackage, setDataTailwind } from "../store/sandpackSetting";
import { GetData } from ".";

export const getWidgetElements = async ({
  projectId,
  dispatch,
}: {
  projectId: string;
  dispatch: any;
}) => {
  const res = await axiosInstance.get(`/elements/widgetElements`, {
    params: {
      projectId,
    },
  });
  dispatch(setListWidgetElements(res.data.data));
};

export const getDataConfigGit = async ({
  projectId,
  path,
}: {
  projectId: string;
  path: string;
}) => {
  const res = await axiosInstance.get(`/${path}`, {
    params: {
      projectId,
    },
  });
  return _.get(res, "data.data.content", "");
};

const listFileSandpackSetting = [
  {
    name: "package",
    setDataRedux: (value: any, dispatch: any) =>
      dispatch(setDataPackage(value)),
  },
  {
    name: "tailwind",
    setDataRedux: (value: any, dispatch: any) =>
      dispatch(setDataTailwind(value)),
  },
];

export const getDataSandpackSetting = async ({
  dispatch,
  projectId,
}: {
  dispatch: any;
  projectId: string;
}) => {
  const [] = await Promise.all(
    _.map(listFileSandpackSetting, async ({ name, setDataRedux }) => {
      const content = await getDataConfigGit({
        projectId,
        path: name,
      });
      setDataRedux(content, dispatch);
      return content;
    })
  );
};

export const getElements = async (dispatch: any) => {
  try {
    const response = await GetData(
      `${import.meta.env.VITE__API_HOST}/api/elements`
    );
    if (response) {
      let newData = _.get(response, "data", []);
      newData = _.map(newData, (item: any) => ({
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
        thumbnail: item?.thumbnail || "",
      }));
      dispatch(setDataElements(newData));
    }
  } catch (error) {}
};
