import React, {useState} from "react";
import Draggable from "../drangable";
import {v4} from "uuid";
import {sample_data} from "../../config/common";
import {getUniqueContentItems} from "../../utilities";
import {DragEndEvent, DragStartEvent} from "@dnd-kit/core";

const Sidebar = () => {
  return (
    <div className="h-[calc(100vh-4rem)] w-full sticky top-4 rounded-r-xl flex-col gap-12 flex items-center bg-white rounded-lg p-6 max-w-96 z-50">
      <span className="mx-auto w-full font-bold text-3xl">Sidebar</span>
      <Draggable
        className="w-full min-h-28 bg-blue-100 flex items-center justify-center rounded-xl"
        detail={{columns: "2", rows: "2", type: "layout"}}
        id={v4()}
      >
        <div className={`p-2 my-2 border rounded-xl text-center truncate`}>
          Layout
        </div>
      </Draggable>
      <div className="px-6 flex flex-wrap gap-2">
        {getUniqueContentItems(sample_data).map((item, index) => (
          <Draggable
            className="flex items-center justify-center bg-green-100 w-full aspect-video rounded-xl"
            detail={{columns: item.columns, rows: item.rows, type: item.type}}
            key={index}
            id={item.id}
          >
            <div className={`p-2 my-2 rounded-xl text-center truncate`}>
              {item.id}
            </div>
          </Draggable>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
