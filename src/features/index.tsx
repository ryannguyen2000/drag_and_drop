import { useDispatch, useSelector } from "react-redux";
import Draggable from "../components/drangable";
import Droppable from "../components/droppable";
import {RootState} from "../store";
import {GridCol, GridRow, SpanCol, SpanRow} from "../utilities";
import {setActiveData, setActiveId} from "../store/DndSlice";
import {useEffect} from "react";
import {ToastBlank} from "../components/toast";

const ItemsRenderer = ({
  id,
  columns,
  rows,
  colspan,
  rowspan,
  type,
  childs,
  currentDepth,
}: {
  id: string;
  columns: string;
  rows: string;
  colspan: string;
  rowspan: string;
  type: string;
  childs: any[];
  currentDepth: number;
}) => {
  const { activeId } = useSelector((state: RootState) => state.dndSlice);
  const dispatch = useDispatch();

  const totalCells = Number(columns) * Number(rows);
  const totalChildren = childs.length + Number(colspan) + Number(rowspan);
  const emptyCells = Math.max(0, totalCells - totalChildren);

  if (currentDepth >= 6) {
    ToastBlank({
      msg: "Maximum deep level is 6",
      className: "bg-yellow-300",
    });
  }

  return (
    <div className="w-full h-full">
      {type === "layout" && (
        <Droppable
          className={`p-2 w-full h-full border border-dashed bg-white ${
            activeId === id && "border-green-500 border-2"
          }`}
          columns={columns}
          rows={rows}
          rowspan={rowspan}
          colspan={colspan}
          type={type}
          key={id}
          id={id}>
          <div
            className={`grid gap-1 ${GridRow(Number(rows))} ${GridCol(
              Number(columns)
            )}`}>
            {childs.map((child: any) => (
              <Draggable
                className={`
                } ${SpanCol(Number(child.colspan))} ${SpanRow(
                  Number(child.rowspan)
                )}`}
                {...child}
                key={child.id}
                id={child.id}>
                <ItemsRenderer {...child} currentDepth={currentDepth + 1} />
              </Draggable>
            ))}
            {Array.from({ length: emptyCells }).map((_, index) => (
              <div
                key={`empty-${index}`}
                className="border border-dashed min-h-12 w-full border-gray-500"
              />
            ))}
          </div>
        </Droppable>
      )}

      {type === "content" && (
        <div
          className={`p-2 border h-full border-dashed ${
            activeId === id && "border-2 border-green-500"
          } ${SpanRow(Number(rowspan))} ${SpanCol(
            Number(colspan)
          )} bg-gray-100`}
          onClick={() => {
            dispatch(setActiveId(id));
          }}>
          {type}: {id}
          {childs.map((child: any) => (
            <Draggable {...child} key={child.id} id={child.id}>
              <ItemsRenderer {...child} currentDepth={currentDepth + 1} />
            </Draggable>
          ))}
        </div>
      )}
    </div>
  );
};

export default ItemsRenderer;
