import { useDispatch, useSelector } from "react-redux";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Icon } from "@iconify/react";
import { CSSProperties } from "react";
import _ from "lodash";

import { RootState } from "../../store";
import { setActiveId } from "../../store/DndSlice";

interface DraggableProps {
  id: string;
  thumbnail?: string;
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
  style?: CSSProperties;
  identify?: string;
  styling?: CSSProperties;
}

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
  style,
  styling,
  thumbnail = "",
  identify,
}: DraggableProps) => {
  const { attributes, listeners, setNodeRef, over, transform } = useDraggable({
    id: _.toString(id),
    data: {
      colspan,
      rowspan,
      columns,
      rows,
      type,
      gap,
      alignItems,
      justifyContent,
      thumbnail,
    },
  });
  const newStyleDiv = {
    transform: CSS.Translate.toString(transform),
    ...styling,
    ...style,
  };

  const newStyleIcon = {
    transform: CSS.Translate.toString(transform),
    ...styling,
  };
  return (
    <div
      ref={setNodeRef}
      style={newStyleDiv}
      className={`${className}  cursor-pointer ${
        over ? "border-violet-500" : ""
      }`}
      {...listeners}
      {...attributes}
    >
      {children}
    </div>
  );
};

export default Draggable;
