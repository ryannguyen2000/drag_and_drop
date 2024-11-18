import {useDraggable, useDroppable} from "@dnd-kit/core";
import {CSS} from "@dnd-kit/utilities";
import {Icon} from "@iconify/react";
import {setActiveId, setActiveData} from "../../DndSlice";
import {useDispatch} from "react-redux";
const Draggable = ({
  colspan,
  rowspan,
  columns,
  type,
  rows,
  id,
  children,
  className = "",
}: {
  id: string;
  colspan: string;
  rowspan: string;
  columns: string;
  type: string;
  rows: string;
  className?: string;
  children: React.ReactNode;
}) => {
  const {attributes, listeners, setNodeRef, over, transform} = useDraggable({
    id: id.toString(),
    data: {
      colspan,
      rowspan,
      columns,
      rows,
      type,
    },
  });
  const style = {
    transform: CSS.Translate.toString(transform),
  };

  const dispatch = useDispatch();

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`min-h-12 ${className} cursor-pointer ${
        over ? "border-violet-500" : ""
      } relative group`}
      onClick={(event) => {
        event.stopPropagation();
        event.preventDefault();
        dispatch(setActiveId(id));
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
