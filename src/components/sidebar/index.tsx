import React from "react";
import Draggable from "../drangable";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {v4} from "uuid";

const Sidebar = () => {
  const sidebar = useSelector((state: RootState) => state.dndSlice.sidebar);

  return (
    <div className="h-[calc(100vh-4rem)] w-full sticky top-4 rounded-r-xl flex-col gap-12 flex  bg-gray-100 rounded-lg p-6 max-w-[330px] z-50 items-center ">
      <span className="mx-auto w-full font-bold text-3xl">Sidebar</span>
      <Draggable
        className="w-full min-h-24 bg-[#444] text-white flex items-center justify-center rounded-xl"
        columns="1"
        rows="1"
        type="layout"
        colspan="1"
        rowspan="1"
        id={v4()}>
        <div className="p-2 my-2  rounded-xl text-center truncate">Layout</div>
      </Draggable>
      <div className="px-6 flex flex-wrap gap-2 overflow-y-scroll overflow-x-hidden">
        {sidebar.map((item, index) => (
          <Draggable
            className="w-24 h-16 bg-[#444] text-white flex items-center justify-center rounded-xl"
            {...item}
            key={index}
            id={item.id}>
            <div className="p-2 rounded-xl text-center truncate">{item.id}</div>
          </Draggable>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
