import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import Sidebar from "../../../components/sidebar";

const Setting = () => {
  const { data, sidebar, activeCreateFunction, typeScreen, moveSliceParent } =
    useSelector((state: RootState) => state.dndSlice);

  const renderSidebar = !activeCreateFunction && <Sidebar />;

  return <div className="flex">{renderSidebar}</div>;
};

export default Setting;
