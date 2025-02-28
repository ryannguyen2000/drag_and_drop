import _ from "lodash";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setBreakpoint, setTypeScreen } from "../../../store/DndSlice";
import { RootState } from "../../../store";
import { BREAKPOINTS } from "../../../utilities/const/common";

const ReponsiveData = () => {
  const { typeScreen, breakpoint } = useSelector(
    (state: RootState) => state.dndSlice
  );

  const isMobileType = typeScreen === "mobile";

  const dispatch = useDispatch();
  const filteredBreakpoints = _.pick(BREAKPOINTS, ["laptop", "pc"]);

  const debouncedDispatch = useCallback(
    _.debounce((newType, key) => {
      const setStore =
        key === "type" ? setTypeScreen(newType) : setBreakpoint(newType);
      // : setBreakpoint(typeScreen === "mobile" ? "style" : newType);
      dispatch(setStore);
    }, 200),
    [dispatch]
  );

  const handleChange = (title, key) => {
    debouncedDispatch(title, key);
  };

  return (
    <div className="flex items-center gap-2 text-[12px] text-[#c3c3c3]">
      <div className=" text-center flex gap-2">
        <div className="self-center font-semibold">Screen's data:</div>
        <select
          name="screenType"
          id="screenType"
          value={typeScreen}
          onChange={(e) => handleChange(e.target.value, "type")}
          className="rounded cursor-pointer border py-[4px] text-gray-700 font-semibold"
        >
          <option value="desktop">Desktop</option>
          <option value="mobile">Mobile</option>
        </select>
      </div>
      {!isMobileType && (
        <div className="text-center flex gap-2">
          <select
            name="breakpoint"
            id="breakpoint"
            value={breakpoint}
            className="rounded cursor-pointer border px-[6px] py-[4px] text-gray-700 font-semibold"
            onChange={(e) => handleChange(e.target.value, "size")}
          >
            {Object.values(filteredBreakpoints).map((bp) => (
              <option key={bp.type} value={bp.style}>
                {bp.title} ({bp.minWidth}px -{" "}
                {bp.maxWidth === Infinity ? "∞" : `${bp.maxWidth}px`})
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default ReponsiveData;
