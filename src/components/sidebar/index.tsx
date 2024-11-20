import React, {useEffect, useState} from "react";
import Draggable from "../drangable";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import {v4} from "uuid";
import {io} from "socket.io-client";
import {setSidebar} from "../../DndSlice";
import {formatText} from "../../utilities/text";
import {Icon} from "@iconify/react/dist/iconify.js";
import {getPastelColor} from "../../utilities/colors";

const Sidebar = () => {
  const sidebar = useSelector((state: RootState) => state.dndSlice.sidebar);
  const dispatch = useDispatch();

  useEffect(() => {
    const socket = io(
      "https://serverless-tn-layout-production.up.railway.app",
      {
        withCredentials: true,
        transports: ["websocket"],
      }
    );

    socket.on("webhook-data", (data) => {
      console.log(data);
      dispatch(setSidebar(data));
      // alert("Webhook " + data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="h-[calc(100vh)] w-full sticky top-4 rounded-r-xl flex-col gap-12 flex  bg-gray-100 rounded-lg p-6 max-w-[25rem] z-50 items-center ">
      <div className="mx-auto w-full font-bold text-3xl ">Elements</div>
      <div className="grid grid-cols-2 gap-4 px-4 w-full">
        <Draggable
          className="w-full h-16 col-span-1 bg-[#444] text-white flex items-center justify-center rounded-xl"
          columns="1"
          rows="1"
          type="grid"
          colspan="1"
          rowspan="1"
          alignItems="flex-start"
          justifyContent="flex-start"
          gap="1"
          id={v4()}
        >
          <div className="flex gap-2 justify-center items-center">
            <Icon icon="ph:columns" fontSize={28} />
            <div className="rounded-xl text-center truncate text-sm">
              Grid Layout
            </div>
          </div>
        </Draggable>
        <Draggable
          className="w-full h-16 bg-[#444] text-white flex items-center justify-center rounded-xl"
          columns="1"
          rows="1"
          type="flex"
          colspan="1"
          rowspan="1"
          alignItems="flex-start"
          justifyContent="flex-start"
          gap="1"
          id={v4()}
        >
          <div className="flex gap-2 justify-center items-center p-7">
            <Icon icon="ph:square" fontSize={28} />
            <div className="rounded-xl text-center text-sm truncate">
              Box Layout
            </div>
          </div>
        </Draggable>
      </div>
      <div className="px-4 w-full gap-2 grid grid-cols-4 ">
        {sidebar.map((item, index) => (
          <Draggable
            styling={{backgroundColor: getPastelColor(index, 4)}}
            className="col-span-1 w-full h-16 text-white flex items-center justify-center rounded-xl"
            {...item}
            key={index}
            id={item.id}
          >
            <div
              title={formatText(item.id)}
              className="p-2 rounded-xl text-center text-sm truncate line-clamp-2"
            >
              {formatText(item.id)}
            </div>
          </Draggable>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
