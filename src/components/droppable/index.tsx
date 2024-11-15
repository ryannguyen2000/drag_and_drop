// Droppable component
import {useDroppable} from "@dnd-kit/core";
import {ReactNode} from "react";
import {
  setActiveId,
  setColumns,
  setRows,
  setRowspan,
  setColspan,
} from "../../DndSlice";
import {useDispatch} from "react-redux";

const Droppable = ({
  id,
  detail,
  children,
  className = "",
}: {
  id: string;
  detail: any;
  className?: string;
  children: ReactNode;
}) => {
  const {isOver, setNodeRef} = useDroppable({
    id,
    data: detail,
  });

  const dispatch = useDispatch();

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(setActiveId(id));
        detail.type === "layout" && dispatch(setColumns(detail.columns));
        detail.type === "layout" && dispatch(setRows(detail.rows));
        dispatch(setRowspan(detail.rowspan));
        dispatch(setColspan(detail.colspan));
      }}
      ref={setNodeRef}
      onDragOver={(e) => e.preventDefault()}
      className={`${className} ${
        isOver ? "border-red-400" : "border-gray-400"
      } p-2`}
    >
      {children}
    </div>
  );
};

export default Droppable;
