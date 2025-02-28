import { Icon } from "@iconify/react/dist/iconify.js";
import { v4 } from "uuid";
import Draggable from "../../draggable";

const FrameBoxAndFlex = () => {
  return (
    <div className="flex gap-4 w-full">
      <Draggable
        className="w-[100px] h-[62px] flex items-center justify-center rounded-xl border-[0.5px]"
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
        <div className="flex flex-col gap-2 justify-center items-center">
          <Icon icon="ph:columns" fontSize={28} />
          <div className="rounded-xl text-center truncate text-[12px]">
            Grid Layout
          </div>
        </div>
      </Draggable>
      <Draggable
        className={`w-[100px] h-[62px] flex items-center justify-center rounded-xl border-[0.5px]`}
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
        <div className="flex flex-col gap-2 justify-center items-center p-7">
          <Icon icon="ph:square" fontSize={28} />
          <div className="rounded-xl text-center text-[12px] truncate">
            Box Layout
          </div>
        </div>
      </Draggable>
    </div>
  );
};

export default FrameBoxAndFlex;
