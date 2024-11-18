import React from "react";
import Draggable from "../drangable";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {v4} from "uuid";

const Sidebar = () => {
  const sidebar = useSelector((state: RootState) => state.dndSlice.sidebar);

  return (
    <div className="h-[calc(100vh-4rem)] w-full sticky top-4 rounded-r-xl flex-col gap-12 flex items-center bg-white rounded-lg p-6 max-w-96 z-50">
      <span className="mx-auto w-full font-bold text-3xl">Sidebar</span>
      <Draggable
        className="w-full min-h-28 bg-blue-100 flex items-center justify-center rounded-xl"
        columns="1"
        rows="1"
        type="layout"
        colspan="1"
        rowspan="1"
        id={v4()}
      >
        <div className="p-2 my-2 border rounded-xl text-center truncate">
          Layout
        </div>
      </Draggable>
      <div className="px-6 flex flex-wrap gap-2">
        {sidebar.map((item, index) => (
          <Draggable
            className="w-24 h-24 bg-green-100 flex items-center justify-center rounded-xl"
            {...item}
            key={index}
            id={item.id}
          >
            <div className="p-2 rounded-xl text-center truncate">{item.id}</div>
          </Draggable>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
