import _ from "lodash";

const HoverStyles = ({ styles, setStyles }) => {
  const handleBackgroundChange = (key: string, value: string) => {
    setStyles((prevStyles) => ({
      ...prevStyles,
      hover: {
        ..._.get(prevStyles, "hover"),
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
        <span className="font-semibold text-gray-800 capitalize">Hover</span>
        <svg
          className="size-5 shrink-0 transition duration-300 group-open:-rotate-180"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </summary>
      <ul className="flexgap-3 w-full mt-2 p-4 bg-white shadow-lg rounded-b-xl">
        <li>
          <div className="flex flex-col items-center justify-start p-2 gap-1.5">
            <div className="w-full">Background:</div>
            <textarea
              onChange={(e) =>
                handleBackgroundChange("background", e.target.value)
              }
              value={_.get(styles, "hover.background", "")}
              placeholder="Enter background (e.g., 'radial-gradient(...)')"
              className="w-full border border-gray-300 p-2 rounded"
              rows={1}
            />
            <div className="text-sm text-gray-500">
              Example:{" "}
              <code>
                radial-gradient(50% 50% at 50% 50%, rgba(20, 20, 22, 0.00)
                50.27%, #141416 100%)
              </code>
            </div>
          </div>
        </li>
      </ul>
    </details>
  );
};

export default HoverStyles;
