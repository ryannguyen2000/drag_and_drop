import _ from "lodash";
import { propertiesAfterBefore } from "../const";

const BeforeStyles = ({ styles, setStyles }) => {
  const handleStyleChange = (key: string, value: string) => {
    setStyles((prevStyles) => ({
      ...prevStyles,
      before: {
        ..._.get(prevStyles, "before", {}),
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
          Before Styles
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
                value={_.get(styles, `before.${key}`, "")}
                placeholder={`Enter before ${key}`}
                className="w-full border border-gray-300 p-2 rounded"
                rows={1}
              />
            </div>
          </li>
        ))}
      </ul>
    </details>
  );
};

export default BeforeStyles;
