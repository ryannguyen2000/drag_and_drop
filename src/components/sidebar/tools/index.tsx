import ToolFrameEditor from "./ToolFrameEditor";
import ReponsiveData from "./ToolResponData";

const ToolEditor = (props) => {
  return (
    <div className="w-full flex justify-between">
      <ToolFrameEditor {...props} />
      <ReponsiveData />
    </div>
  );
};

export default ToolEditor;
