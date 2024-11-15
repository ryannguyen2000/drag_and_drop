import {useDraggable, useDroppable} from "@dnd-kit/core";
import {CSS} from "@dnd-kit/utilities";
import {Icon} from "@iconify/react";
import {
  setActiveId,
  setColumns,
  setRows,
  setColspan,
  setRowspan,
} from "../../DndSlice";
import {useDispatch} from "react-redux";
const Draggable = ({
  detail,
  id,
  children,
  className = "",
}: {
  id: string;
  detail: any;
  className?: string;
  children: React.ReactNode;
}) => {
  const {attributes, listeners, setNodeRef, over, transform} = useDraggable({
    id: id.toString(),
    data: detail,
  });
  const style = {
    transform: CSS.Translate.toString(transform),
  };

  const dispatch = useDispatch();

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={` ${className} cursor-pointer ${
        over ? "border-violet-500" : ""
      } relative group`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(setActiveId(id));
        detail.type === "layout" && dispatch(setColumns(detail.columns));
        detail.type === "layout" && dispatch(setRows(detail.rows));
        dispatch(setRowspan(detail.rowspan));
        dispatch(setColspan(detail.colspan));
      }}
    >
      <Icon
        icon="ph:dots-six-vertical"
        className="group-hover:block hidden transition-all absolute top-0 right-0 bg-white border-none cursor-grab focus-visible:border-none hover:border-none focus:border-none outline-none focus-visible:outline-none focus:outline-none hover:outline-none"
        fontSize={24}
        {...listeners}
        {...attributes}
      />
      {children}
    </div>
  );
};

export default Draggable;
