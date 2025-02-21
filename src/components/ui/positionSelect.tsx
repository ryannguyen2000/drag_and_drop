import _ from "lodash";
import { CSSProperties } from "react";

interface PositionSelectProps {
  styles: CSSProperties;
  changePosition: any;
}

const PositionSelect = ({ styles, changePosition }: PositionSelectProps) => {
  return (
    <li>
      <span className="text-sm font-medium text-gray-400">Position</span>
      <div className="flex items-center justify-center gap-2">
        <select
          id="position"
          className="border border-gray-300 appearance-none h-10 px-2 text-sm w-full rounded-lg focus:ring-blue-500 focus:border-blue-500 block cursor-pointer"
          value={_.get(styles, "position", "none")}
          onChange={changePosition}
        >
          <option value="">none</option>
          <option value="fixed">fixed</option>
          <option value="absolute">absolute</option>
          <option value="relative">relative</option>
          <option value="sticky">static</option>
          <option value="sticky">sticky</option>
        </select>
      </div>
    </li>
  );
};

export default PositionSelect;
