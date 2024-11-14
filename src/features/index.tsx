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
  const dispatch = useDispatch();
  return (
    <div
      className="peer-hover:border-pink-400 border w-full"
      onClick={() => {
        dispatch(setActiveId(id));
        type === "layout" && dispatch(setColumns(columns));
        type === "layout" && dispatch(setRows(rows));
        dispatch(setColspan(colspan));
        dispatch(setRowspan(rowspan));
      }}
    >
      {type === "layout" && (
        <>
          {Array({length: Number(columns)}).map((_, index) => (
            <Droppable
              className={`p-6 w-full border-2 border-dashed ${
                type === "layout" ? "bg-blue-50" : "bg-blue-50"
              } ${id === "root" && "min-h-screen"} ${SpanCol(
                Number(colspan)
              )} ${SpanRow(Number(rowspan))}`}
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
                className={`grid w-full h-full min-h-32 ${GridRow(
                  Number(rows)
                )} ${GridCol(Number(columns))} ${SpanCol(
                  Number(colspan)
                )} ${SpanRow(Number(rowspan))}`}
              >
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
            </Droppable>
          ))}
        </>
      )}
      {type === "content" && (
        <div
          className={`p-6 border-2 border-dashed ${SpanRow(
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
