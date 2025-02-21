import { splitDimensions } from "../../../utilities/text";
import DimensionInput from "../../commom/input";

const Margin = ({ styles, setStyles }) => {
  const handleMarginChange = (
    value: string | number,
    direction: "top" | "right" | "bottom" | "left",
    unit: string
  ) => {
    setStyles((prevStyles) => {
      const marginValues = (prevStyles?.margin || "0px 0px 0px 0px")
        .toString() // Đảm bảo là chuỗi
        .split(" "); // Chuyển thành mảng

      const directionIndex = { top: 0, right: 1, bottom: 2, left: 3 }[
        direction
      ]; // Lấy vị trí
      marginValues[directionIndex] = `${value}${unit}`; // Cập nhật giá trị kèm unit

      const newMargin = marginValues.join(" "); // Gộp lại thành chuỗi

      // Kiểm tra nếu tất cả các giá trị là 0
      if (
        marginValues.every(
          (val) =>
            val === "0px" || val === "0rem" || val === "0em" || val === "0%"
        )
      ) {
        const { margin, ...rest } = prevStyles; // Loại bỏ margin nếu tất cả giá trị là 0
        return rest;
      }

      return { ...prevStyles, margin: newMargin }; // Cập nhật margin nếu không phải 0
    });
  };

  return (
    <details className="group w-full [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex cursor-pointer w-full items-center justify-between gap-1.5 rounded-lg bg-white p-4 text-gray-900">
        <span className="font-semibold text-gray-800 capitalize">Margin</span>
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

      <ul className="grid grid-cols-2 gap-3 w-full mt-2 p-4 bg-white shadow-lg rounded-b-xl">
        {["margin"].map((property, index) => {
          const marginValue = styles?.hasOwnProperty(property)
            ? styles[property as keyof typeof styles]
            : "0px 0px 0px 0px";
          const [top, right, bottom, left] = splitDimensions(
            String(marginValue)
          );

          return (
            <div key={index + "Margin"}>
              <li key="top">
                <span className="text-sm font-medium text-gray-400">Top</span>
                <DimensionInput
                  defaultValue={Number.parseInt(top)} // Chuyển đổi thành số
                  defaultUnit={top.replace(/[0-9]/g, "")} // Lấy đơn vị (px, em, rem, ...)
                  onChange={(value) =>
                    handleMarginChange(value.inputValue, "top", value.unit)
                  }
                />
              </li>
              <li key="right">
                <span className="text-sm font-medium text-gray-400">Right</span>
                <DimensionInput
                  defaultValue={Number.parseInt(right)}
                  defaultUnit={right.replace(/[0-9]/g, "")}
                  onChange={(value) =>
                    handleMarginChange(value.inputValue, "right", value.unit)
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
                    handleMarginChange(value.inputValue, "bottom", value.unit)
                  }
                />
              </li>
              <li key="left">
                <span className="text-sm font-medium text-gray-400">Left</span>
                <DimensionInput
                  defaultValue={Number.parseInt(left)}
                  defaultUnit={left.replace(/[0-9]/g, "")}
                  onChange={(value) =>
                    handleMarginChange(value.inputValue, "left", value.unit)
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

export default Margin;
