import BtnHandleCreateFc from "../../../components/propertiesbar/components/btnHandleCreateFc";
import BtnPublish from "../../../components/propertiesbar/components/btnPublish";

const RenderToolbarMonaco = ({ hidden }) => {
  return (
    !hidden && (
      <div className="w-full flex justify-end items-center gap-2 p-2">
        <BtnHandleCreateFc />
        <BtnPublish />
      </div>
    )
  );
};

export default RenderToolbarMonaco;
