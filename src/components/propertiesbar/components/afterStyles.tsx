import _ from "lodash";
import { propertiesAfterBefore } from "../const";
import PositionSelect from "../../ui/positionSelect";

const AfterStyles = ({ styles, setStyles }) => {
  const handleStyleChange = (key: string, value: string) => {
    setStyles((prevStyles) => ({
      ...prevStyles,
      after: {
        ..._.get(prevStyles, "after", {}),
        [key]: value,
      },
    }));
  };

  return (
    <details
      className="group w-full [&_summary::-webkit-details-marker]:hidden"
      open
    >
      <summary className="flex cursor-pointer w-full items-center justify-between gap-1.5 rounded-lg bg-white p-4 text-gray-900">
        <span className="font-semibold text-gray-800 capitalize">
          After Styles
        </span>
      </summary>
      <ul className="w-full mt-2 p-4 bg-white shadow-lg rounded-b-xl">
        {propertiesAfterBefore.map((key) => (
          <li key={key}>
            <div className="flex flex-col items-start justify-start p-2 gap-1.5">
              <span className="text-sm font-medium text-gray-700">
                {key.toUpperCase()}:
              </span>
              <textarea
                onChange={(e) => handleStyleChange(key, e.target.value)}
                value={_.get(styles, `after.${key}`, "")}
                placeholder={`Enter after ${key}`}
                className="w-full border border-gray-300 p-2 rounded"
                rows={2}
              />
            </div>
          </li>
        ))}

        <PositionSelect
          changePosition={(e: any) =>
            handleStyleChange("position", e.target.value)
          }
          styles={_.get(styles, "after")}
        />
      </ul>
    </details>
  );
};

export default AfterStyles;
