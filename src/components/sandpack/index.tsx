import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  useSandpack,
  SANDBOX_TEMPLATES,
} from "@codesandbox/sandpack-react";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import _ from "lodash";

import { RootState } from "../../store";
import LoadingEditor from "../monacoEditor/loadingEditor";

interface SandpackEditorProps {
  data: string;
  fileNameShow?: string;
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

const getPackageJsonContent = (dataPackage: any) => {
  const defaultPackage =
    SANDBOX_TEMPLATES["react-ts"].files["/package.json"].code;

  try {
    const userPackage = dataPackage
      ? JSON.parse(dataPackage)
      : JSON.parse(defaultPackage);

    // Merge với dependencies mặc định
    return {
      ...userPackage,
      dependencies: {
        ...userPackage.dependencies,
        lodash: "latest",
        "@types/lodash": "^4.14.197",
        "react-icons": "^4.7.1",
        tailwindcss: "latest",
        postcss: "latest",
        autoprefixer: "latest",
      },
      devDependencies: {
        ...userPackage.devDependencies,
        "@types/react": "^18.2.0",
        "@types/react-dom": "^18.2.0",
      },
    };
  } catch (error) {
    console.error("Invalid package.json format:", error);
    return JSON.parse(defaultPackage);
  }
};

const getTailwindConfig = (dataTailwind: any) => {
  return (
    dataTailwind ||
    `export default {
    content: [
      "./app/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: { extend: {} },
    plugins: [],
  };`
  );
};

const SandpackEditor = ({
  data,
  fileNameShow,
  handleEditorChange,
}: SandpackEditorProps) => {
  const { dataPackage, dataTailwind } = useSelector(
    (state: RootState) => state.sandpackSetting
  );

  const { loadingMonacoEditor } = useSelector(
    (state: RootState) => state.dndSlice
  );
  const ExternalCodeUpdater = ({ code }: { code: string }) => {
    return null;
  };

  const listData = {
    "/App.tsx": data,
    "/package.json": getPackageJsonContent(dataPackage),
    "/tailwind.config.ts": getTailwindConfig(dataTailwind),
  };

  let packageJsonCode = "{}"; // Mặc định là object rỗng dưới dạng string

  if (listData["/package.json"]) {
    if (typeof listData["/package.json"] === "string") {
      try {
        packageJsonCode = JSON.parse(listData["/package.json"]);
      } catch (error) {
        console.error("Lỗi parse package.json:", error);
      }
    } else {
      // Nếu đã là object, không cần parse nữa
      packageJsonCode = listData["/package.json"];
    }
  }

  return (
    <div className="flex w-full">
      <div className="w-full relative">
        <SandpackProvider
          template="react-ts"
          customSetup={{
            dependencies: {
              lodash: "latest",
              "@types/lodash": "^4.14.197",
              "react-icons": "^4.7.1",
              tailwindcss: "latest",
              postcss: "latest",
              autoprefixer: "latest",
            },
            environment: "node",
          }}
          files={{
            ...SANDBOX_TEMPLATES["react-ts"].files,
            "/App.tsx": {
              code: listData["/App.tsx"],
            },
            "/package.json": {
              code: JSON.stringify(packageJsonCode, null, 2), // Convert object về JSON string
            },
            "/tailwind.config.ts": {
              code: listData["/tailwind.config.ts"],
            },
          }}
          options={{
            visibleFiles: [fileNameShow],
            activeFile: fileNameShow,
          }}
        >
          <ExternalCodeUpdater code={listData[fileNameShow]} />
          <SandpackLayout>
            <SandpackCodeEditor
              style={{ height: "90vh", width: "60%" }}
              showLineNumbers
              showInlineErrors
            />
          </SandpackLayout>
          <CustomCodeEditor onChange={handleEditorChange} />
        </SandpackProvider>

        {loadingMonacoEditor && <LoadingEditor />}
      </div>
    </div>
  );
};

export default SandpackEditor;
