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
    <div className="mb-4 flex items-center gap-2 text-[12px]">
      <div className="border rounded text-center flex px-[6px] py-[4px]">
        <div className="self-center">Screen's Type:</div>
        <select
          name="screenType"
          id="screenType"
          value={typeScreen}
          onChange={(e) => handleChange(e.target.value, "type")}
          className="rounded-md cursor-pointer"
        >
          <option value="desktop">Desktop</option>
          <option value="mobile">Mobile</option>
        </select>
      </div>
      {!isMobileType && (
        <div className="border rounded text-center flex px-[6px] py-[4px]">
          <div className="self-center">Screen's Size</div>
          <select
            name="breakpoint"
            id="breakpoint"
            value={breakpoint}
            className="rounded-md cursor-pointer"
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
