import _ from "lodash";
import { CSSProperties, useEffect, useState } from "react";

import Droppable from "../components/droppable";
import Draggable from "../components/draggable";
import ItemsRenderer, { ItemsRenderProps } from ".";
import { SpanCol, SpanRow } from "../utilities";
import { isValidColor } from "./BoxLayout";
import { useSelector } from "react-redux";
import { RootState } from "../store";

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
  dataSlice,
  columns,
  rows,
  gap,
  alignItems,
  justifyContent,
  type,
  ...props
}: SliceItemProps) => {
  const { breakpoint } = useSelector((state: RootState) => state.dndSlice);
  const url = _.get(dataSlice, "url");

  const bgItems = "";

  const safeStyle = {
    ...style,
    backgroundColor: isValidColor(style?.backgroundColor)
      ? style.backgroundColor
      : undefined,
  };

  return (
    <Droppable
      className={`${
        url ? "" : "p-2"
      }  border text-center h-full border-dashed flex justify-center items-center ${
        activeId === id && "border-2 border-green-500"
      } ${SpanRow(Number(rowspan))} ${SpanCol(Number(colspan))} ${bgItems} `}
      style={safeStyle}
      id={id}
      columns={columns}
      rows={rows}
      colspan={colspan}
      rowspan={rowspan}
      gap={gap}
      alignItems={alignItems}
      justifyContent={justifyContent}
      type={type}
    >
      <RenderContent
        type={type}
        id={id}
        dataSlice={dataSlice}
        style={style}
        url={url}
      />
      {childs.map((child: any) => (
        <Draggable
          {...child}
          key={child.id}
          dataSlice={dataSlice}
          id={child.id}
        >
          <ItemsRenderer {...child} currentDepth={currentDepth + 1} />
        </Draggable>
      ))}
    </Droppable>
  );
};

const RenderContent = ({ id, dataSlice, style, type, url }) => {
  const title = _.get(dataSlice, "title") || id.split("$")[0];

  const styleUrlTitle: CSSProperties = url
    ? {
        position: "absolute",
        zIndex: "",
        top: "50%",
        transform: "translateY(-50%) translateX(-50%)",
        left: "50%",
        color: "white",
      }
    : {};
  return (
    <div className="w-full">
      {!url && <div style={styleUrlTitle}>{title}</div>}
      <Media style={style} url={url} />
    </div>
  );
};

const Media = ({ url, style }: { url?: string; style }) => {
  const [isVisible, setIsVisible] = useState(false);

  const newStyle: CSSProperties | undefined = {
    ...style,
    inset: 0,
    objectFit: "fill",
  };

  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById("background-compo");
      const rect = element?.getBoundingClientRect();
      if (rect && rect.top < window.innerHeight && rect.bottom > 0) {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Kiểm tra ngay khi component được render

    return () => window.removeEventListener("scroll", handleScroll);
  }, [url]);

  if (!url) {
    return;
  }

  return (
    <div id="background-compo">
      {!_.isEmpty(url) &&
        isVisible &&
        (url?.match(/\.(jpeg|jpg|gif|png|svg|webp)$/i) ? (
          <img style={newStyle} src={url} alt="Preview" className="w-full" />
        ) : url?.match(/\.(mp4|mov|avi|mkv|webm)$/i) ? (
          <video
            style={newStyle}
            autoPlay
            loop
            muted
            playsInline
            className="w-full aspect-video absolute top-0 left-0"
            src={url}
            preload="metadata"
          >
            <source src={`${url}.webm`} type="video/webm" />
            <source src={url} type="video/mp4" />
          </video>
        ) : (
          <p>Unsupported media type</p>
        ))}
    </div>
  );
};

export default SliceItem;
