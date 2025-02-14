import { Icon } from "@iconify/react/dist/iconify.js";
import { v4 } from "uuid";
import Draggable from "../draggable";

const FrameBoxAndFlex = () => {
  return (
    <div className={`flex-grow  px-4 w-full flex flex-col gap-3`}>
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
          id={`Grid-${v4()}`}
          thumbnail="_"
          identify="grid"
          styling={{}}
        >
          <div className="flex gap-2 justify-center items-center">
            <Icon icon="ph:columns" fontSize={28} />
            <div className="rounded-xl text-center truncate text-sm">
              Grid Layout
            </div>
          </div>
        </Draggable>
        <Draggable
          className={`w-full h-16 bg-[#444] text-white flex items-center justify-center rounded-xl`}
          columns="1"
          rows="1"
          type="flex"
          colspan="1"
          rowspan="1"
          alignItems="flex-start"
          justifyContent="flex-start"
          gap="1"
          id={`Box-${v4()}`}
          thumbnail="_"
          identify="box"
          styling={{}}
        >
          <div className="flex gap-2 justify-center items-center p-7">
            <Icon icon="ph:square" fontSize={28} />
            <div className="rounded-xl text-center text-sm truncate">
              Box Layout
            </div>
          </div>
        </Draggable>
      </div>
    </div>
  );
};

export default FrameBoxAndFlex;
