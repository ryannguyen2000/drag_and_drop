import {useDroppable} from "@dnd-kit/core";
import {ReactNode} from "react";

const Droppable = ({
  id,
  detail,
  children,
  className,
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

  return (
    <div
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
