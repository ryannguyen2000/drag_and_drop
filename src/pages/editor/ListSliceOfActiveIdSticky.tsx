import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";

const ListSliceOfActiveIdSticky = () => {
  const dispatch = useDispatch();
  const { activeData,  } = useSelector((state: RootState) => state.dndSlice);

  return (
    <div className="z-[99999999999] relative">
      <div className="fixed bottom-4 right-[15%] bg-blue-500 text-white p-3 rounded-lg shadow-lg animate-bounce">
        👋 Xin chào! Tôi ở đây nè.
      </div>
    </div>
  );
};

export default ListSliceOfActiveIdSticky;

{
  /* <div className="fixed top-4 left-4 bg-white p-2 shadow-md rounded">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isVisible}
            onChange={() => setIsVisible(!isVisible)}
            className="form-checkbox h-4 w-4 text-blue-500"
          />
          <span className="text-sm text-gray-700">Hiển thị góc trái dưới</span>
        </label>
      </div> */
}
