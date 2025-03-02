import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  useSandpack,
  REACT_TEMPLATE,
  SANDBOX_TEMPLATES,
} from "@codesandbox/sandpack-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import { RootState } from "../../store";
import LoadingEditor from "../monacoEditor/loadingEditor";

interface SandpackEditorProps {
  data: string;
  handleEditorChange: (code: string) => void;
}

const CustomCodeEditor = ({
  onChange,
}: {
  onChange: (code: string) => void;
}) => {
  const { sandpack } = useSandpack();
  const { files, activeFile } = sandpack;
  const prevCodeRef = useRef<string>("");

  useEffect(() => {
    const currentCode = files[activeFile].code;

    if (prevCodeRef.current !== currentCode) {
      prevCodeRef.current = currentCode;
      onChange(currentCode);
    }
  }, [files[activeFile].code]);

  return null;
};

const SandpackEditor = ({ data, handleEditorChange }: SandpackEditorProps) => {
  const [activeFile, setActiveFile] = useState<string>("/App.js");

  const { loadingMonacoEditor } = useSelector(
    (state: RootState) => state.dndSlice
  );

  const ExternalCodeUpdater = ({ code }: { code: string }) => {
    const { sandpack } = useSandpack();
    const prevCode = useRef(code);

    useEffect(() => {
      if (
        code !== prevCode.current &&
        code !== sandpack.files["/App.js"].code
      ) {
        sandpack.updateFile("/App.js", code);
        prevCode.current = code;
      }
    }, [code, sandpack]);

    return null;
  };

  return (
    <div className="flex w-full">
      <div className="w-full relative">
        <SandpackProvider
          template="react"
          customSetup={{
            dependencies: { lodash: "latest" },
            environment: "node",
          }}
          files={{
            ...Object.fromEntries(
              Object.entries(SANDBOX_TEMPLATES.react.files).map(
                ([path, file]) => {
                  if (path === "/package.json") return [path, file];
                  return [path, { ...file, hidden: true }];
                }
              )
            ),
            "/App.js": data,
          }}
          options={{
            visibleFiles: ["/App.js", "/package.json"],
            activeFile: activeFile,
          }}
        >
          <ExternalCodeUpdater code={data} />
          <SandpackLayout>
            <SandpackCodeEditor
              style={{ height: "90vh", width: "60%" }}
              showLineNumbers
              showInlineErrors
            />
            {/* <SandpackPreview
              style={{ height: "90vh", width: "40%" }}
              showNavigator
            /> */}
          </SandpackLayout>
          <CustomCodeEditor onChange={handleEditorChange} />
        </SandpackProvider>

        {loadingMonacoEditor && <LoadingEditor />}
      </div>
    </div>
  );
};

export default SandpackEditor;
