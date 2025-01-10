import _ from "lodash";
import ItemsRenderer, { ItemsRenderProps } from ".";
import Draggable from "../components/draggable";
import { SpanCol, SpanRow } from "../utilities";
import { formatText } from "../utilities/text";
import { isValidColor } from "./BoxLayout";

type SliceItemProps = ItemsRenderProps & {
  activeId?: string;
  emptyCells?: number | null;
  isParentBg?: React.CSSProperties;
};

const SliceItem = ({
  rowspan,
  colspan,
  style,
  id,
  childs,
  currentDepth,
  activeId,
  isParentBg,
}: SliceItemProps) => {
  const bgItems = isValidColor(isParentBg)
    ? ""
    : "bg-gray-100";

  const safeStyle = {
    ...style,
    backgroundColor: isValidColor(style?.backgroundColor)
      ? style.backgroundColor
      : undefined,
  };

  return (
    <div
      className={`p-2 border text-center h-full border-dashed flex justify-center items-center ${
        activeId === id && "border-2 border-green-500"
      } ${SpanRow(Number(rowspan))} ${SpanCol(
        Number(colspan)
      )} ${bgItems} animate-jump-in`}
      style={safeStyle}
    >
      {formatText(id)}
      {childs.map((child: any) => (
        <Draggable {...child} key={child.id} id={child.id}>
          <ItemsRenderer {...child} currentDepth={currentDepth + 1} />
        </Draggable>
      ))}
    </div>
  );
};

export default SliceItem;

// import ItemsRenderer, { ItemsRenderProps } from ".";
// import Draggable from "../components/draggable";
// import { SpanCol, SpanRow } from "../utilities";
// import { formatText } from "../utilities/text";

// type SliceItemProps = ItemsRenderProps & {
//   activeId?: string;
//   emptyCells?: number | null;
//   dispatch?: any;
//   setActiveId?: (e: any) => void;
//   styleParent?: React.CSSProperties;
// };

// const SliceItem = ({
//   rowspan,
//   colspan,
//   style,
//   id,
//   childs,
//   currentDepth,
//   activeId,
//   dispatch,
//   setActiveId,
// }: SliceItemProps) => {
//   return (
//     <div
//       className={`p-2 border text-center h-full border-dashed flex justify-center items-center ${
//         activeId === id && "border-2 border-green-500"
//       } ${SpanRow(Number(rowspan))} ${SpanCol(
//         Number(colspan)
//       )} bg-gray-100 animate-jump-in`}
//       style={style}
//       onClick={() => {
//         dispatch(setActiveId(id));
//       }}
//     >
//       {formatText(id)}
//       {childs.map((child: any) => (
//         <Draggable {...child} key={child.id} id={child.id}>
//           <ItemsRenderer {...child} currentDepth={currentDepth + 1} />
//         </Draggable>
//       ))}
//     </div>
//   );
// };

// export default SliceItem;
