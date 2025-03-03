import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import Draggable from "../../draggable";
import { GetData } from "../../../apis";
import { setDataElements } from "../../../store/DndWidget";
import { RootState } from "../../../store";

const formatDataForDraggle = (data) => {
  data = _.map(data, (item: any) => ({
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
  return data;
};

const ListDraggle = ({ lockScroll, groupedSide }) => {
  const { data, listWidgetElements } = useSelector(
    (state: RootState) => state.dndWidgets
  );
  const dispatch = useDispatch();

  const getElements = async () => {
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

  useEffect(() => {
    getElements();
  }, []);
  return (
    // Default Elements
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-3 max-h-[500px] overflow-y-scroll pr-2 scrollbar-thin scrollbar-thumb-slate-500 scrollbar-track-transparent scrollbar-hide">
        {_.map(data, (item, index) => {
          return (
            <Draggable className="relative" {...item} key={index} id={item.id}>
              <div className="p-4 rounded-xl flex justify-start items-center border-[0.5px] w-[180px]">
                <div className="text-center text-sm truncate line-clamp-2">
                  {item.name}
                </div>
              </div>
              <input type="" />
            </Draggable>
          );
        })}
      </div>

      {/* Widgets Custom */}
      <div className="flex flex-col gap-3 max-h-[400px] overflow-y-scroll pr-2 scrollbar-thin scrollbar-thumb-slate-500 scrollbar-track-transparent scrollbar-hide">
        {_.map(formatDataForDraggle(listWidgetElements), (item, index) => {
          return (
            <Draggable className="relative" {...item} key={index} id={item.id}>
              <div className="p-4 rounded-xl flex justify-start items-center border-[0.5px] w-[180px]">
                <div className="text-center text-sm truncate line-clamp-2">
                  {item.name}
                </div>
              </div>
            </Draggable>
          );
        })}
      </div>
    </div>
  );
};

export default ListDraggle;
