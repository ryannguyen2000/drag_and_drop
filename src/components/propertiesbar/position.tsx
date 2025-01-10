import React from "react";
import { splitDimensions } from "../../utilities/text";
import DimensionInput from "../commom/input";

const Position = ({
  styles,
  setStyles,
}: {
  styles: React.CSSProperties;
  setStyles: any;
}) => {
  const changePosition = (value: any) => {
    setStyles((prevStyles) => ({
      ...prevStyles,
      position: value,
    }));
  };

  const handlePositionXY = (
    value: string | number,
    property: "top" | "right" | "bottom" | "left",
    unit: string
  ) => {
    console.log('handlePositionXY', {
      value,
      property,
      unit
    });
    
    if (value === 0 || value === "0") {
      setStyles((prevStyles) => {
        const newStyles = { ...prevStyles };
        delete newStyles[property];
        return newStyles;
      });
    } else {
      setStyles((prevStyles) => ({
        ...prevStyles,
        [property]: `${value}${unit}`,
      }));
    }
  };

  return (
    <details>
      <summary className="flex cursor-pointer w-full items-center justify-between gap-1.5 rounded-lg bg-white p-4 text-gray-900">
        <span className="font-semibold text-gray-800 capitalize">Position</span>
        <svg
          className="size-5 shrink-0 transition duration-300 group-open:-rotate-180"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </summary>

      <ul className="flexgap-3 w-full mt-2 p-4 bg-white shadow-lg rounded-b-xl">
        <li>
          <span className="text-sm font-medium text-gray-400">Position</span>
          <div className="flex items-center justify-center gap-2">
            <select
              id="position"
              className="border border-gray-300 appearance-none h-10 px-2 text-sm w-full rounded-lg focus:ring-blue-500 focus:border-blue-500 block cursor-pointer"
              // value={styles?.backgroundPosition}
              onChange={(e) => changePosition(e.target.value)}
            >
              <option value="static">static</option>
              <option value="fixed">fixed</option>
              <option value="absolute">absolute</option>
              <option value="relative">relative</option>
              <option value="sticky">sticky</option>
            </select>
          </div>
        </li>

        {["positionXY"].map((property, index) => {
          const paddingValue = styles?.hasOwnProperty(property)
            ? styles[property as keyof typeof styles]
            : "0px 0px 0px 0px";
          const [top, right, bottom, left] = splitDimensions(
            String(paddingValue)
          );

          return (
            <div key={index + "positionXY"}>
              <li key="top">
                <span className="text-sm font-medium text-gray-400">Top</span>
                <DimensionInput
                  defaultValue={Number.parseInt(top)} // Chuyển đổi thành số
                  defaultUnit={top.replace(/[0-9]/g, "")} // Lấy đơn vị (px, em, rem, ...)
                  onChange={(value) =>
                    handlePositionXY(value.inputValue, "top", value.unit)
                  }
                />
              </li>
              <li key="right">
                <span className="text-sm font-medium text-gray-400">Right</span>
                <DimensionInput
                  defaultValue={Number.parseInt(right)}
                  defaultUnit={right.replace(/[0-9]/g, "")}
                  onChange={(value) =>
                    handlePositionXY(value.inputValue, "right", value.unit)
                  }
                />
              </li>
              <li key="bottom">
                <span className="text-sm font-medium text-gray-400">
                  Bottom
                </span>
                <DimensionInput
                  defaultValue={Number.parseInt(bottom)}
                  defaultUnit={bottom.replace(/[0-9]/g, "")}
                  onChange={(value) =>
                    handlePositionXY(value.inputValue, "bottom", value.unit)
                  }
                />
              </li>
              <li key="left">
                <span className="text-sm font-medium text-gray-400">Left</span>
                <DimensionInput
                  defaultValue={Number.parseInt(left)}
                  defaultUnit={left.replace(/[0-9]/g, "")}
                  onChange={(value) =>
                    handlePositionXY(value.inputValue, "left", value.unit)
                  }
                />
              </li>
            </div>
          );
        })}
      </ul>
    </details>
  );
};

export default Position;
