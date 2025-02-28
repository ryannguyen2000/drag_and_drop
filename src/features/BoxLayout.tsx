export const isValidColor = (color) => {
  return (
    typeof color === "string" && /^#([0-9A-F]{3}|[0-9A-F]{6})$/i.test(color)
  );
};

import Droppable from "../components/droppable";
import Draggable from "../components/draggable";
import ItemsRenderer, { ItemsRenderProps } from ".";
import { convertAlign, convertJustify } from "../utilities/flex";
import { Gap } from "../utilities/grid";
import _ from "lodash";
import { useSelector } from "react-redux";
import { RootState } from "../store";

type BoxLayoutProps = ItemsRenderProps & {
  activeId?: string;
  emptyCells?: number | null;
};

const BoxLayout = ({
  columns,
  rows,
  rowspan,
  colspan,
  alignItems,
  justifyContent,
  style,
  gap,
  id,
  childs,
  type,
  thumbnail,
  currentDepth,
  activeId,
  emptyCells,
  ...props
}: BoxLayoutProps) => {
  const { breakpoint } = useSelector((state: RootState) => state.dndSlice);

  return (
    <Droppable
      className={`p-2 border border-dashed  ${
        activeId === id && "border-green-500 border-2 "
      }`}
      columns={columns}
      rows={rows}
      rowspan={rowspan}
      colspan={colspan}
      alignItems={alignItems}
      justifyContent={justifyContent}
      gap={gap}
      type={type}
      key={id}
      id={id}
      thumbnail={thumbnail}
      style={style}
    >
      <div
        className={`flex animate-fade-down ${convertJustify(
          justifyContent
        )} ${convertAlign(alignItems)} ${Gap(Number(gap))}`}
      >
        {childs.map((child: any) => {
          const styleDraggle = {
            ...child[breakpoint],
            padding: "",
            border: "",
            borderRadius: "",
          };

          return (
            <Draggable
              className={`animate-jump-in`}
              {...child}
              style={{ ...styleDraggle }}
              key={child.id}
              id={child.id}
            >
              <ItemsRenderer
                {...child}
                style={child[breakpoint]}
                currentDepth={currentDepth + 1}
                isParentBg={_.get(style, "backgroundColor")}
              />
            </Draggable>
          );
        })}
        {Array.from({ length: emptyCells }).map((_, index) => (
          <div
            key={`empty-${index}`}
            className="border border-dashed w-full border-gray-500"
          />
        ))}
      </div>
    </Droppable>
  );
};

export default BoxLayout;
