import Editor from "@monaco-editor/react";
import { useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import {
  MonacoJsxSyntaxHighlight,
  getWorker,
} from "monaco-jsx-syntax-highlight";
import LoadingEditor from "./loadingEditor";

interface MonacoEditorProps {
  defaultCode: string;
  data: any;
  handleEditorChange: any;
}

const MonacoEditor = ({
  defaultCode,
  data,
  handleEditorChange,
}: MonacoEditorProps) => {
  const editorRef = useRef(null);
  const { loadingMonacoEditor } = useSelector(
    (state: RootState) => state.dndSlice
  );

  const handleEditorDidMount = useCallback(async (editor: any, monaco: any) => {
    editorRef.current = editor;

    // Định nghĩa module giả lập cho lodash
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      `declare module "lodash" {
        const _: typeof import("lodash");
        export default _;
      }`,
      "file:///node_modules/lodash/index.d.ts"
    );

    // Cấu hình TypeScript compiler options
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      jsx: monaco.languages.typescript.JsxEmit.Preserve,
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      esModuleInterop: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.ESNext,
      allowSyntheticDefaultImports: true,
    });

    // JSX syntax highlighting
    const monacoJsxSyntaxHighlight = new MonacoJsxSyntaxHighlight(
      getWorker(),
      monaco
    );
    const { highlighter, dispose } =
      monacoJsxSyntaxHighlight.highlighterBuilder({
        editor: editor,
      });
    highlighter();

    editor.onDidChangeModelContent(() => {
      highlighter();
    });

    return dispose;
  }, []);

  return (
    <div className="flex w-full">
      <div className="w-full relative">
        <Editor
          height="90vh"
          path={"file:///src/component/monacoEditor/index.tsx"}
          onMount={handleEditorDidMount}
          defaultLanguage="typescript"
          defaultValue={defaultCode}
          onChange={handleEditorChange}
          theme="vs-dark"
          value={data}
          options={{
            fontSize: 16,
            lineHeight: 28,
            automaticLayout: true,
          }}
          loading={
            <div className="relative flex flex-col justify-center items-center">
              <div className="rounded-md h-12 w-12 border-4 border-t-4 border-blue-500 animate-spin"></div>
              <div className="">Loading Monaco Editor...</div>
            </div>
          }
        />
        {loadingMonacoEditor && <LoadingEditor />}
      </div>
    </div>
  );
};

export default MonacoEditor;
