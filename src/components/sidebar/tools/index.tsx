import ToolFrameEditor from "./ToolFrameEditor";
import ReponsiveData from "./ToolResponData";

const ToolEditor = (props) => {
  return (
    <div className="w-full flex justify-between bg-[#14181b] py-2">
      <div className="w-1/4"></div>
      <div className="w-1/2 flex justify-between">
        <ToolFrameEditor {...props} />
        <ReponsiveData />
      </div>
      <div className="w-1/4"></div>
    </div>
  );
};

export default ToolEditor;
