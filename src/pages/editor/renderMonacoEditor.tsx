import { deflateRaw } from "zlib";
import MonacoEditor from "../../components/monacoEditor";

const RenderMonacoEditor = ({ hidden }) => {
  return (
    !hidden && (
      <div className="w-2/3">
        <MonacoEditor />
      </div>
    )
  );
};

export default RenderMonacoEditor;
