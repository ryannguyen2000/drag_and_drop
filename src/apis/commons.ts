import _ from "lodash";
import { setDataCustomWidget, setListWidgetElements } from "../store/DndWidget";
import axiosInstance from "./axiosInstance";

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

export const getTailwindConfig = async ({
  targetRepo,
  dispatch,
}: {
  targetRepo: string;
  dispatch: any;
}) => {
  const res = await axiosInstance.get(`/tailwindConfig`, {
    params: {
      targetRepo,
    },
  });
  dispatch(setDataCustomWidget({ data: _.get(res, "data.data.content", "") }));
};
