import {useDispatch, useSelector} from "react-redux";
import Draggable from "../components/drangable";
import Droppable from "../components/droppable";
import {RootState} from "../store";
import {GridCol, GridRow, SpanCol, SpanRow} from "../utilities";
import {
  setActiveData,
  setActiveId,
  setColspan,
  setColumns,
  setRows,
  setRowspan,
} from "../store/DndSlice";

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
  const {activeId} = useSelector((state: RootState) => state.dndSlice);
  const dispatch = useDispatch();
  const totalCells = Number(columns) * Number(rows);
  const totalChildren = childs.length + Number(colspan) + Number(rowspan);

  const emptyCells = totalCells - totalChildren;
  return (
    <div className="peer-hover:border-pink-400 h-full border w-full">
      {type === "layout" && (
        <>
          {Array({length: Number(columns)}).map((_, index) => (
            <Droppable
              className={`p-2 w-full h-full border border-dashed ${
                type === "layout" ? "bg-blue-50" : "bg-blue-50"
              }`}
              detail={{
                columns: columns,
                rows: rows,
                rowspan: rowspan,
                colspan: colspan,
                type: type,
              }}
              key={id}
              id={id}
            >
              {type}: {id}
              <div
                className={`grid gap-1 ${GridRow(Number(rows))} ${GridCol(
                  Number(columns)
                )}`}
              >
                {childs.length > 0 &&
                  childs.map((child: any) => (
                    <Draggable
                      className={`${
                        activeId === child.id && "border border-yellow-500"
                      } ${SpanCol(Number(child.colspan))} ${SpanRow(
                        Number(child.rowspan)
                      )}`}
                      detail={{
                        columns: child.columns,
                        rows: child.rows,
                        colspan: child.colspan,
                        rowspan: child.rowspan,
                        type: child.type,
                      }}
                      key={child.id}
                      id={child.id}
                    >
                      <ItemsRenderer
                        id={child.id}
                        columns={child.columns}
                        rows={child.rows}
                        colspan={child.colspan}
                        rowspan={child.rowspan}
                        type={child.type}
                        childs={child.childs}
                        currentDepth={currentDepth + 1}
                      />
                    </Draggable>
                  ))}
                {Array.from({length: emptyCells}).map((_, index) => (
                  <div
                    key={`empty-${index}`}
                    className="border border-dashed min-h-12 w-full border-gray-300"
                  />
                ))}
              </div>
            </Droppable>
          ))}
        </>
      )}
      {type === "content" && (
        <div
          className={`p-2 border h-full border-dashed ${SpanRow(
            Number(rowspan)
          )} ${SpanCol(Number(colspan))} ${
            type === "content" ? "bg-yellow-50" : "bg-blue-50"
          }`}
        >
          {type}: {id}
          {childs.length > 0 &&
            childs.map((child: any) => (
              <Draggable
                detail={{
                  columns: child.columns,
                  rows: child.rows,
                  colspan: child.colspan,
                  rowspan: child.rowspan,
                  type: child.type,
                }}
                key={child.id}
                id={child.id}
              >
                <ItemsRenderer
                  id={child.id}
                  columns={child.columns}
                  rows={child.rows}
                  colspan={child.colspan}
                  rowspan={child.rowspan}
                  type={child.type}
                  childs={child.childs}
                  currentDepth={currentDepth + 1}
                />
              </Draggable>
            ))}
        </div>
      )}
    </div>
  );
};

export default ItemsRenderer;
