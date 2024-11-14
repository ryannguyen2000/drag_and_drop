import {useSelector} from "react-redux";
import Draggable from "../components/drangable";
import Droppable from "../components/droppable";
import {RootState} from "../store";
import {GridCol} from "../utilities";

const ItemsRenderer = ({
  id,
  columns,
  rows,
  type,
  childs,
  currentDepth,
}: {
  id: string;
  columns: string;
  rows: string;
  type: string;
  childs: any[];
  currentDepth: number;
}) => {
  return (
    <>
      {type === "layout" && (
        <>
          {Array({length: Number(columns)}).map((item: any) => (
            <Droppable
              className={`p-6 border-2 border-dashed ${
                type === "layout" ? "bg-blue-50" : "bg-blue-50"
              } ${id === "root" && "min-h-screen"} ${GridCol(Number(columns))}`}
              detail={{columns: columns, rows: rows, type: type}}
              key={id}
              id={id}
            >
              <div>
                {type}: {id}
                {childs.length > 0 &&
                  childs.map((child: any) => (
                    <Draggable
                      className=""
                      detail={{
                        columns: child.columns,
                        rows: child.rows,
                        type: child.type,
                      }}
                      key={child.id}
                      id={child.id}
                    >
                      <ItemsRenderer
                        id={child.id}
                        columns={child.columns}
                        rows={child.rows}
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
          className={`p-6 border-2 border-dashed ${
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
                  type: child.type,
                }}
                key={child.id}
                id={child.id}
              >
                <ItemsRenderer
                  id={child.id}
                  columns={child.columns}
                  rows={child.rows}
                  type={child.type}
                  childs={child.childs}
                  currentDepth={currentDepth + 1}
                />
              </Draggable>
            ))}
        </div>
      )}
    </>
  );
};

export default ItemsRenderer;
