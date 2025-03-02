export const DEVICE_DIMENSIONS = {
  Responsive: { width: 0, height: 0 }, // Kích thước linh hoạt
  Mobile: { width: 375, height: 667 },
  Tablet: { width: 768, height: 1024 },
  Laptop: { width: 1366, height: 768 },
  Desktop: { width: 1920, height: 1080 },
  UltraWide: { width: 2560, height: 1440 },
  "4K": { width: 3840, height: 2160 },
};

export const defaultContentWidgetElement = `import _ from "lodash";
import { CSSProperties } from "react";

interface TextProps {
  data?: any;
  style?: CSSProperties;
}

const TextCustom = ({ data, style }: TextProps) => {
  const title = _.get(data, "title", "Title Header");

  const newStyle: CSSProperties = {
    ...style,
  };

  return (
    <div
      style={newStyle}
      className="text-[#858585]"
    >
      {title}
    </div>
  );
};

export default TextCustom;`