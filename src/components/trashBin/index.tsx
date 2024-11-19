import { useDroppable } from "@dnd-kit/core";

const TrashBin = () => {
  const { isOver, setNodeRef } = useDroppable({
    id: "trash-bin",
  });

  return (
    <div
      ref={setNodeRef}
      className={`w-20 h-20 fixed flex items-center justify-center rounded-full shadow-lg ${
        isOver ? "bg-red-500" : "bg-gray-300"
      } flex items-center justify-center`}>
      <img src="/icons/trash.svg" alt="Trash Bin" className="w-8 h-8" />
    </div>
  );
};

export default TrashBin;
