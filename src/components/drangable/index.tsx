import {useDraggable, useDroppable} from "@dnd-kit/core";
import {CSS} from "@dnd-kit/utilities";

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

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className={`cursor-grab ${className} ${over ? "border-violet-500" : ""}`}
    >
      {children}
    </div>
  );
};

export default Draggable;
