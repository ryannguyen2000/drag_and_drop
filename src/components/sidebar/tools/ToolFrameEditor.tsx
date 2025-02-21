import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { setViewport } from "../../../store/DndSlice";
import { DEVICE_DIMENSIONS } from "../../../utilities/consts";

const ToolFrameEditor = () => {
  const dispatch = useDispatch();
  const { viewport } = useSelector((state: RootState) => state.dndSlice);

  const handleChange = (key: string, value: string | number) => {
    dispatch(setViewport({ ...viewport, [key]: value }));
  };

  const handleDimensionChange = (device: string) => {
    const { width, height } =
      DEVICE_DIMENSIONS[device as keyof typeof DEVICE_DIMENSIONS];
    dispatch(
      setViewport({
        ...viewport,
        dimensions: device,
        width,
        height,
      })
    );
  };

  return (
    <div className="mb-4 flex items-center gap-2 text-[12px]">
      {/* Dropdown for Dimensions */}
      <select
        className="border p-1 rounded"
        value={viewport.dimensions}
        onChange={(e) => handleDimensionChange(e.target.value)}
      >
        {Object.keys(DEVICE_DIMENSIONS).map((device) => (
          <option key={device} value={device}>
            Dimensions: {device}
          </option>
        ))}
      </select>

      {/* Input for Width */}
      <input
        type="number"
        min="0"
        className="border p-1 rounded w-16 text-center"
        value={viewport.width}
        onChange={(e) =>
          handleChange("width", parseInt(e.target.value, 10) || 0)
        }
      />
      <span className="text-gray-600">x</span>

      {/* Input for Height */}
      <input
        type="number"
        min="0"
        className="border p-1 rounded w-16 text-center"
        value={viewport.height}
        onChange={(e) =>
          handleChange("width", parseInt(e.target.value, 10) || 0)
        }
      />

      {/* Dropdown for Zoom */}
      <select
        className="border p-1 rounded"
        value={viewport.zoomMode}
        onChange={(e) => handleChange("zoomMode", e.target.value)}
      >
        <option value="auto">Auto</option>
        <option value="100%">100%</option>
        <option value="75%">75%</option>
        <option value="50%">50%</option>
        <option value="25%">25%</option>
      </select>
    </div>
  );
};

export default ToolFrameEditor;
