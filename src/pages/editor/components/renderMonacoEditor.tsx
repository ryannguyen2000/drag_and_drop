import MonacoEditor from "../../../components/monacoEditor";
import { setDataComponent } from "../../../store/DndSlice";
import { useDispatch } from "react-redux";
import { defaultCode } from "../../../components/monacoEditor/const";

const RenderMonacoEditor = ({ hidden }) => {
  const dispatch = useDispatch();

  const handleEditorChange = (value: any) => {
    dispatch(setDataComponent(value));
  };
  return (
    !hidden && (
      <div className="w-2/3">
        <MonacoEditor
          defaultCode={defaultCode}
          data={""}
          handleEditorChange={handleEditorChange}
        />
      </div>
    )
  );
};

export default RenderMonacoEditor;
