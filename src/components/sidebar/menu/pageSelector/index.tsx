import { useState } from "react";
import ModalAddJson from "../../components/modalAddJson";
import Header from "../../components/header";

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

export default PageSelector;
