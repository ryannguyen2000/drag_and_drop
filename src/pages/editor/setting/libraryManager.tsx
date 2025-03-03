import _ from "lodash";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { setSelectedLibs } from "../../../store/sandpackSetting";

export const DEFAULT_LIBRARIES = [
  { name: "shadcn/ui", version: "latest" },
  { name: "react-hook-form", version: "^7.50.0" },
  { name: "zustand", version: "^4.4.7" },
  { name: "framer-motion", version: "^10.16.0" },
  { name: "@mui/material", version: "^5.14.20" },
];

const LibraryManager = ({ onDependenciesChange }) => {
  // const [selectedLibs, setSelectedLibs] = useState<string[]>([]);
  const dispatch = useDispatch();

  const { selectedLibs } = useSelector(
    (state: RootState) => state.sandpackSetting
  );

  const handleToggleLib = (libName: string) => {
    let newSelectedLibs = selectedLibs;

    newSelectedLibs = newSelectedLibs.includes(libName)
      ? newSelectedLibs.filter((l) => l !== libName)
      : [...newSelectedLibs, libName];
    dispatch(setSelectedLibs(newSelectedLibs));
  };

  // Gửi dependencies về parent component
  useEffect(() => {
    const deps = DEFAULT_LIBRARIES.reduce((acc, lib) => {
      if (selectedLibs.includes(lib.name)) {
        acc[lib.name] = lib.version;
      }
      return acc;
    }, {});

    onDependenciesChange(deps);
  }, [selectedLibs]);

  return (
    <div className="w-64 p-4 border-r h-screen overflow-y-auto">
      <h2 className="text-lg font-bold mb-4 text-white">External libraries</h2>
      <div className="space-y-2">
        {DEFAULT_LIBRARIES.map((lib) => (
          <label
            key={lib.name}
            className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer text-white hover:text-gray-700"
          >
            <input
              type="checkbox"
              checked={selectedLibs.includes(lib.name)}
              onChange={() => handleToggleLib(lib.name)}
              className="mr-2"
            />
            <div className="flex flex-col">
              <div className="font-medium">{lib.name}</div>
              <div className="text-sm">
                version:{" "}
                <strong className="text-green-400">{lib.version}</strong>
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default LibraryManager;
