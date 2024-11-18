// Droppable component
import {useDroppable} from "@dnd-kit/core";
import {ReactNode, useEffect} from "react";
import {setActiveId, setActiveData} from "../../DndSlice";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";

const Droppable = ({
  id,
  columns,
  rows,
  colspan,
  rowspan,
  type,
  children,
  className = "",
}: {
  id: string;
  columns: string;
  rows: string;
  colspan: string;
  rowspan: string;
  type: string;
  className?: string;
  children: ReactNode;
}) => {
  const {isOver, setNodeRef} = useDroppable({
    id,
    data: {
      columns,
      rows,
      colspan,
      rowspan,
      type,
    },
  });

  const {activeData, activeId} = useSelector(
    (state: RootState) => state.dndSlice
  );
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(" active data: " + activeId);
    console.log(" active data: " + JSON.stringify(activeData));
  }, [activeData, activeId]);

  return (
    <div
      ref={setNodeRef}
      onDragOver={(e) => e.preventDefault()}
      className={`${className} min-h-12 ${
        isOver ? "border-red-400" : "border-gray-400"
      } p-2`}
      onClick={(event) => {
        event.stopPropagation();
        event.preventDefault();
        dispatch(setActiveId(id));
      }}
    >
      {children}
    </div>
  );
};

export default Droppable;
