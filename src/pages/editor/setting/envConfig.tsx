import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { setDataEnv } from "../../../store/DndWidget";

interface EnvironmentVariable {
  key: string;
  value: string;
  type: string;
  target: string[];
}

const EnvConfig = () => {
  const dispatch = useDispatch();
  const { dataEnv } = useSelector((state: RootState) => state.dndWidgets);

  const initialData: EnvironmentVariable[] = [
    /* Your initial data array here */
  ];

  // const [data, setData] = useState<EnvironmentVariable[]>(initialData);

  const handleAddNew = () => {
    dispatch(
      setDataEnv([
        ...dataEnv,
        {
          key: "",
          value: "",
          type: "plain",
          target: ["production", "preview", "development"],
        },
      ])
    );
  };

  const handleChange = (
    index: number,
    field: "key" | "value",
    newValue: string
  ) => {
    let newData = [...dataEnv];

    newData = newData.map((item, i) =>
      i === index ? { ...item, [field]: newValue } : item
    );
    console.log("handleChange", {
      newValue,
      field,
      index,
      newData,
    });
    newData[index][field] = newValue;
    // setData(newData);

    dispatch(setDataEnv(newData));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Environment Variables</h1>
        <button
          onClick={handleAddNew}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Add New Variable
        </button>
      </div>

      <div className="space-y-4">
        {dataEnv.map((item, index) => (
          <div key={index} className="border rounded-lg p-4 bg-white shadow-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Key</label>
                <input
                  type="text"
                  value={item.key}
                  onChange={(e) => handleChange(index, "key", e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter key"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Value</label>
                <input
                  type="text"
                  value={item.value}
                  onChange={(e) => handleChange(index, "value", e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter value"
                />
              </div>
            </div>

            {/* Display non-editable fields */}
            <div className="mt-3 text-sm text-gray-600">
              <p>Type: {item.type}</p>
              <p>Target: {item.target.join(", ")}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Debug output */}
      {/* <div className="mt-8 p-4 bg-gray-50 rounded">
        <pre>{JSON.stringify(dataEnv, null, 2)}</pre>
      </div> */}
    </div>
  );
};

export default EnvConfig;
