import _ from "lodash";
import { useEffect } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";

import { RootState } from "../../store";
import { setData, setDataFetchData } from "../../store/DndSlice";
import { GetData } from "../../apis";
import { DecryptBasic } from "../../utilities/hash_aes";
import { GetACookie } from "../../utilities/cookies";
import { Enum } from "../../config/common";
import { setDocumentName } from "../../store/documents/documentSlice";
import ToolEditor from "../../components/sidebar/tools";
import Sidebar from "../../components/sidebar";
import DndContentComponent from "./dndContext";
import Setting from "./setting";
import customWidget from "./customWidget";

const components = {
  1: DndContentComponent,
  2: DndContentComponent,
  3: DndContentComponent,
  4: customWidget,
  5: Setting,
};

const Editor = () => {
  const [{ menuSelected }, { activeCreateFunction }] = useSelector(
    (state: RootState) => [state.sidebar, state.dndSlice],
    shallowEqual
  );

  const dispatch = useDispatch();

  const renderSidebar = !activeCreateFunction && <Sidebar />;

  const Component = components[menuSelected];

  useEffect(() => {
    const fetchData = async () => {
      const response = (await GetData(
        `${import.meta.env.VITE__API_HOST}/api/documents?dId=${DecryptBasic(
          GetACookie("did"),
          Enum.srkey
        )}`
      )) as any;
      if (response && response?.layoutJson) {
        dispatch(setDocumentName(response?.documentName));
        const newLayout = response?.layoutJson;
        dispatch(setDataFetchData(newLayout));
        return;
      }
      dispatch(
        setData({
          id: "root",
          thumnail: "_",
          type: "grid",
          columns: "1",
          gap: "1",
          rows: "1",
          colspan: "1",
          rowspan: "1",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          style: {},
          childs: [],
          dataSlice: {},
        })
      );
      return;
    };

    fetchData();
  }, []);

  return (
    <div className="bg-[#1E2428]">
      <ToolEditor />
      {Component && <Component />}
    </div>
  );
};

export default Editor;
