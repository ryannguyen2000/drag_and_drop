import ItemsRenderer, { ItemsRenderProps } from ".";
import Draggable from "../components/draggable";
import Droppable from "../components/droppable";
import { GridRow } from "../utilities";
import { Gap, GridCol, SpanCol, SpanRow } from "../utilities/grid";

type GridLayoutProps = ItemsRenderProps & {
  activeId?: string;
  emptyCells?: number | null;
};

const GridLayout = ({
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
}: GridLayoutProps) => {
  return (
    <Droppable
      className={`p-2 min-h-12 w-full h-full border border-dashed bg-white animate-fade-down ${
        activeId === id && "border-green-500 border-2 animate-jump-in"
      }`}
      columns={columns}
      rows={rows}
      rowspan={rowspan}
      colspan={colspan}
      alignItems={alignItems}
      justifyContent={justifyContent}
      gap={gap}
      type={type}
      style={style}
      key={id}
      id={id}
      thumbnail={thumbnail}
    >
      <div
        className={`grid gap-1 animate-jump-in  ${GridRow(
          Number(rows)
        )} ${GridCol(Number(columns))} ${Gap(Number(gap))}`}
        style={style}
      >
        {childs.map((child: any) => (
          <Draggable
            className={`
          } ${SpanCol(Number(child.colspan))} ${SpanRow(
              Number(child.rowspan)
            )}`}
            {...child}
            style=""
            key={child.id}
            id={child.id}
          >
            <ItemsRenderer {...child} currentDepth={currentDepth + 1} />
          </Draggable>
        ))}
        {Array.from({ length: emptyCells }).map((_, index) => (
          <div
            key={`empty-${index}`}
            className="border border-dashed min-h-12 w-full border-gray-500 "
          />
        ))}
      </div>
    </Droppable>
  );
};

export default GridLayout;
