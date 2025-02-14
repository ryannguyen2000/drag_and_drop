import clsx from "clsx";
import _ from "lodash";

import style from "./index.module.css";
import Draggable from "../draggable";
import { getPastelColor } from "../../utilities/colors";
import { formatText } from "../../utilities/text";

const ListDraggle = ({ lockScroll, groupedSide }) => {
  return (
    <div
      className={clsx(
        style.hide_scrollbar,
        "flex flex-col gap-3 flex-1 !max-w-full",
        lockScroll ? "overflow-hidden" : "overflow-y-scroll overflow-x-hidden "
      )}
    >
      {groupedSide
        .filter((item: any) => {
          const count = _.get(item, "count", 0);
          return count > 0;
        })
        .map((item: any, index) => {
          const thumbnail = _.get(item, "thumbnail", "");
          const bgSlice =
            !_.isEmpty(thumbnail) && thumbnail !== "_"
              ? thumbnail
              : "/public/no-image.png";
          return (
            <Draggable
              styling={{ backgroundColor: getPastelColor(index, 4) }}
              className={`col-span-1 w-full flex-col text-white flex items-center justify-center rounded-xl ${
                lockScroll && "fixed"
              }`}
              {...item}
              key={index}
              id={item.id}
            >
              <div
                title={formatText(item.id)}
                className="p-4 w-full rounded-xl flex gap-3 justify-start items-center"
              >
                {/* Số lượng */}
                <span className="absolute top-0 left-0 text-xs bg-gray-800 text-white rounded-full px-2 py-1">
                  {item.count}
                </span>
                <img src={bgSlice} alt="" className="w-[50px] h-[50px]" />
                {/* <div className="text-center text-sm truncate line-clamp-2">
                        {formatText("" + item.id)}
                      </div> */}
                <div className="text-center text-sm truncate line-clamp-2">
                  {formatText("" + item.id.split("$")[0])}{" "}
                  {/* Hiển thị tên chuẩn */}
                </div>
              </div>
            </Draggable>
          );
        })}
    </div>
  );
};

export default ListDraggle;
