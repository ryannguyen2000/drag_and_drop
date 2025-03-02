import CheckboxMoveSlice from "../../../../pages/editor/components/checkboxMoveSlice";
import CustomDraggle from "../../components/customDraggle";
import FrameBoxAndFlex from "../../components/frame";
import ListDraggle from "../../components/listDraggle";

const Widgets = ({ projectId, ...props }) => {
  return (
    <div className="flex gap-12 flex-col w-full h-full">
      <div className="gap-12 flex flex-col">
        <CheckboxMoveSlice />
        <FrameBoxAndFlex />
        <ListDraggle groupedSide={[]} lockScroll={true} />
        <CustomDraggle />
      </div>
    </div>
  );
};

export default Widgets;
