import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

import ListCustomWidgets from "./listCustomWidgets";
import { RootState } from "../../../../store";
import { getElements, getWidgetElements } from "../../../../apis/commons";
import { initialNewDataWidget } from "./const";
import ListBaseElements from "./ListBaseElements";
import {
  setActiveWidgetId,
  setDataCustomWidget,
} from "../../../../store/DndWidget";

const CustomWidgets = ({ projectId, ...props }) => {
  const dispatch = useDispatch();
  const { listWidgetElements, data } = useSelector(
    (state: RootState) => state.dndWidgets
  );

  const getData = async () => {
    await Promise.all([
      getWidgetElements({ projectId, dispatch }),
      getElements(dispatch),
    ]);
  };

  const onNewCustomElement = () => {
    dispatch(setActiveWidgetId(null));
    dispatch(
      setDataCustomWidget({
        data: initialNewDataWidget,
      })
    );
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="flex gap-12 flex-col w-full h-full">
      <div className="gap-12 flex flex-col">
        <div>
          <div className="">
            <button
              className="group p-2 rounded-md cursor-pointer relative flex gap-2"
              onClick={onNewCustomElement}
            >
              New Custom Elements
              <Icon
                icon="mdi:plus-outline"
                className="transition-all group-hover:scale-125"
                width={20}
                height={20}
              />
            </button>
          </div>
        </div>
        <ListBaseElements data={data} />
        <ListCustomWidgets data={listWidgetElements} />
      </div>
    </div>
  );
};

export default CustomWidgets;
