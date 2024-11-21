import {useDraggable, useDroppable} from "@dnd-kit/core";
import {CSS} from "@dnd-kit/utilities";
import {Icon} from "@iconify/react";
import {useDispatch} from "react-redux";
import {CSSProperties} from "react";
import { setActiveId } from "../../store/DndSlice";
const Draggable = ({
  colspan,
  rowspan,
  columns,
  type,
  rows,
  alignItems,
  gap,
  justifyContent,
  id,
  children,
  className = "",
  styling,
}: {
  id: string;
  colspan: string;
  rowspan: string;
  columns: string;
  gap: string;
  alignItems: string;
  justifyContent: string;
  type: string;
  rows: string;
  className?: string;
  children: React.ReactNode;
  styling?: CSSProperties;
}) => {
  const {attributes, listeners, setNodeRef, over, transform} = useDraggable({
    id: id.toString(),
    data: {
      colspan,
      rowspan,
      columns,
      rows,
      type,
      gap,
      alignItems,
      justifyContent,
    },
  });
  const style = {
    transform: CSS.Translate.toString(transform),
    ...styling,
  };

  const dispatch = useDispatch();

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`min-h-10 ${className} overflow-hidden cursor-pointer ${
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
        className="group-hover:block hidden transition-all rounded-bl-lg absolute top-0 right-0 text-gray-700 bg-white border-none cursor-grab focus-visible:border-none hover:border-none focus:border-none outline-none focus-visible:outline-none focus:outline-none hover:outline-none"
        fontSize={24}
        {...listeners}
        {...attributes}
      />
      {children}
    </div>
  );
};

export default Draggable;
