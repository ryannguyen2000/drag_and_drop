import { useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import axios from "axios";
import _ from "lodash";
import Modal from "react-modal";

import ShiningButton from "../../../components/button/shiningButton";
import { DecryptBasic } from "../../../utilities/hash_aes";
import { GetACookie } from "../../../utilities/cookies";
import { Enum } from "../../../config/common";
import { ToastSuccess } from "../../../components/toast";
import ModalReact from "../../../components/modalReact";

const ModalActionDocument = ({
  onToggleModal,
  isOpen,
  refreshListDocument,
}) => {
  const [state, setState] = useState({
    documentName: "",
    thumbnail: "",
    uid: "",
    error: "",
  });

  const handleSubmit = async () => {
    const projectId = DecryptBasic(GetACookie("pid"), Enum.srkey);

    if (state.documentName && state.uid) {
      const dataReq = {
        projectId,
        documentName: state.documentName,
        thumbnail: state.thumbnail,
        uid: state.uid,
        layoutJson: {},
      };
      const res = await axios.post(
        `${import.meta.env.VITE__API_HOST}/api/documents`,
        dataReq
      );
      if (res.status === 201) {
        ToastSuccess({ msg: "Create document successfully 🍾" });
        refreshListDocument();
        onToggleModal();
      }
    } else {
      setState((prev) => ({ ...prev, error: "Please do not get abandoned!" }));
    }
  };

  const handleChangeState = (key: string, value: any) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div>
      <div className="group relative">
        <ShiningButton
          icon={
            <Icon icon="ph:plus-thin" className="size-8 font-bold text-white" />
          }
          buttonWrapperClassName="!rounded-full"
          buttonClassName="!rounded-full !bg-neutral-800 !text-black !px-2 !py-1 !text-white"
          onClick={() => onToggleModal()}
        />
        <div className="absolute w-[120px] -top-2/4 -left-2/4 ml-2 bg-black text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
          Create document
        </div>
      </div>

      <ModalReact
        isOpen={isOpen}
        onToggleModal={onToggleModal}
        onSubmit={handleSubmit}
      >
        <h4>Create new document</h4>
        <form className="space-y-6 p-4">
          <div>
            <label
              htmlFor="documentName"
              className="block text-sm font-medium text-gray-700"
            >
              Document Name
            </label>
            <div className="mt-1 relative">
              <input
                type="text"
                id="documentName"
                placeholder="Enter document name"
                value={_.get(state, "documentName")}
                onChange={(e) =>
                  handleChangeState("documentName", e.target.value)
                }
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="documentName"
              className="block text-sm font-medium text-gray-700"
            >
              uid
            </label>
            <div className="mt-1 relative">
              <input
                type="text"
                id="uid"
                placeholder="Enter path your page"
                value={_.get(state, "uid")}
                onChange={(e) => handleChangeState("uid", e.target.value)}
              />
            </div>
          </div>
        </form>
      </ModalReact>
    </div>
  );
};

export default ModalActionDocument;
