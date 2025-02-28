import { useState } from "react";
import CheckboxMoveSlice from "../../../pages/editor/components/checkboxMoveSlice";
import BackToPage from "../components/backToPage";
import FrameBoxAndFlex from "../components/frame";
import Header from "../components/header";
import ListDraggle from "../components/listDraggle";
import ModalAddJson from "../components/modalAddJson";
import CustomDraggle from "../components/customDraggle";

const MenuDetail = ({ id }) => {
  const component = {
    1: <PageSelector />,
    2: <WidgetTree />,
    3: <Widgets />,
    4: <></>,
    5: <></>
  };

  return (
    <div className="h-[calc(100vh)] w-[16rem] sticky top-4 flex-col gap-4 rounded-r-lg flex p-6 items-center text-[#c3c3c3] bg-[#14181b] z-[1]">
      {component[id] || null}
      <div className="fixed bottom-0 left-[100px]">
        <BackToPage />
      </div>
    </div>
  );
};

const PageSelector = () => {
  const [modal, setModal] = useState(false);

  return (
    <div className="flex gap-12 flex-col w-full h-full">
      <ModalAddJson modal={modal} setModal={setModal} />
      <div className="gap-12 flex flex-col">
        <Header setModal={setModal} />
      </div>
    </div>
  );
};

const WidgetTree = () => {
  return (
    <div className="flex gap-12 flex-col w-full h-full">
      <div className="gap-12 flex flex-col">

      </div>
    </div>
  );
};

const Widgets = () => {
  return (
    <div className="flex gap-12 flex-col w-full h-full">
      <div className="gap-12 flex flex-col">
        <CheckboxMoveSlice />
        <FrameBoxAndFlex />
        <ListDraggle groupedSide={[]} lockScroll={true} />
        <CustomDraggle />
      </div>
    </div>
  );
};

export default MenuDetail;
