import _ from "lodash";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import Droppable from "../../components/droppable";
import ItemsRenderer from "../../features";
import { RootState } from "../../store";
import ToolEditor from "../../components/sidebar/tools";

const FrameEditor = ({ activeCreateFunction, dataLayout, data }) => {
  const [scale, setScale] = useState(1);
  const { viewport } = useSelector((state: RootState) => state.dndSlice);

  useEffect(() => {
    const updateScale = () => {
      if (viewport.zoomMode === "auto") {
        const containerWidth = window.innerWidth * 0.8;
        const scaleRatio = containerWidth / viewport.width;
        setScale(scaleRatio);
      } else {
        const zoomLevels = {
          "100%": 1,
          "75%": 0.75,
          "50%": 0.5,
          "25%": 0.25,
        };
        setScale(zoomLevels[viewport.zoomMode]);
      }
    };

    updateScale();
    window.addEventListener("resize", updateScale);

    console.log("viewport", viewport);

    return () => {
      window.removeEventListener("resize", updateScale);
    };
  }, [viewport]);

  return (
    <div
      className={`${
        activeCreateFunction ? "w-1/3" : "w-full"
      } bg-white p-6 z-10 flex items-end justify-center flex-col overflow-hidden`}
    >
      <ToolEditor />
      <div
        className={`${
          activeCreateFunction ? "w-1/3" : "w-full"
        } bg-white z-10 flex items-end justify-center overflow-hidden`}
      >
        <div
          style={{
            borderRadius: "10px",
            overflow: "hidden",
            zoom: scale,
            width: viewport.width,
            height: viewport.height,
          }}
        >
          <div className="bg-white mx-auto w-full min-h-[calc(100vh-7rem)]">
            <Droppable
              columns={_.get(dataLayout, "columns")}
              rows={_.get(dataLayout, "rows")}
              colspan={_.get(dataLayout, "colspan")}
              rowspan={_.get(dataLayout, "rowspan")}
              alignItems={_.get(dataLayout, "alignItems")}
              justifyContent={_.get(dataLayout, "justifyContent")}
              gap={_.get(dataLayout, "gap")}
              type={_.get(dataLayout, "type")}
              id={_.get(dataLayout, "id")}
              thumbnail={_.get(dataLayout, "thumbnail")}
              dataSlice={_.get(dataLayout, "dataSlice")}
            >
              {dataLayout && (
                <ItemsRenderer
                  childs={_.get(dataLayout, "childs")}
                  id={_.get(dataLayout, "id")}
                  columns={_.get(dataLayout, "columns")}
                  rows={_.get(dataLayout, "rows")}
                  colspan={_.get(dataLayout, "colspan")}
                  rowspan={_.get(dataLayout, "rowspan")}
                  alignItems={_.get(dataLayout, "alignItems")}
                  justifyContent={_.get(dataLayout, "justifyContent")}
                  gap={_.get(dataLayout, "gap")}
                  currentDepth={1}
                  type={_.get(dataLayout, "type")}
                  dataSlice={_.get(data, "dataSlice")}
                  thumbnail={_.get(dataLayout, "thumbnail")}
                  style={_.get(dataLayout, "style")}
                />
              )}
            </Droppable>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrameEditor;
