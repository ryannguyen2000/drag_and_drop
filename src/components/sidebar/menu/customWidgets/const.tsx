export const initialNewDataWidget = `import _ from "lodash";
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