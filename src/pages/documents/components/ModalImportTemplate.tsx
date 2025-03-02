import { Icon } from "@iconify/react/dist/iconify.js";
import Modal from "react-modal";
import { useEffect, useState } from "react";
import _ from "lodash";

import axiosInstance from "../../../apis/axiosInstance";
import ShiningButton from "../../../components/button/shiningButton";
import { ToastSuccess } from "../../../components/toast";
import { DecryptBasic } from "../../../utilities/hash_aes";
import { GetACookie } from "../../../utilities/cookies";
import { Enum } from "../../../config/common";

const ModalImportTemplate = ({ onToggleModal, isOpen }) => {
  const [state, setState] = useState({
    dataList: [],
    listSelected: [],
  });

  const projectId = DecryptBasic(GetACookie("pid"), Enum.srkey);

  const getListTemplateComponents = async () => {
    const res = await axiosInstance("templateGitComponent");
    if (res.status === 200) {
      setState((prev) => ({ ...prev, dataList: _.get(res, "data.data") }));
    }
  };

  const onSelected = (name: string) => {
    setState((prev) => {
      const isSelected = prev.listSelected.includes(name);
      return {
        ...prev,
        listSelected: isSelected
          ? prev.listSelected.filter((item) => item !== name)
          : [...prev.listSelected, name],
      };
    });
  };

  const onSave = async () => {
    try {
      const res = await axiosInstance.post("/migrate-components", {
        targetRepo: "project_1",
        components: state.listSelected,
        projectId,
      });
      if (res.status === 200) {
        ToastSuccess({ msg: "Success!" });
        onToggleModal();
      }
    } catch (error) {}
  };

  useEffect(() => {
    getListTemplateComponents();
  }, []);

  return (
    <div>
      <ShiningButton
        icon={
          <Icon icon="ph:plus-thin" className="size-8 font-bold text-white" />
        }
        buttonWrapperClassName="!rounded-full"
        buttonClassName="!rounded-full !bg-neutral-800 !text-black !px-2 !py-1 !text-white"
        onClick={() => onToggleModal()}
      />
      <Modal
        isOpen={isOpen}
        onRequestClose={onToggleModal}
        contentLabel="Modal"
        className="root-modal"
        shouldCloseOnOverlayClick={true}
      >
        <h4>Add templates for all pages</h4>
        <div className="flex flex-col gap-2">
          {_.map(state.dataList, (d, index) => {
            const name = _.get(d, "name", "");
            return (
              <label key={index} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={name}
                  checked={state.listSelected.includes(name)}
                  onChange={() => onSelected(name)}
                />
                {name}
              </label>
            );
          })}
        </div>
        <button
          className="p-2 bg-slate-400 border rounded-lg"
          onClick={() => onSave()}
        >
          Save
        </button>
      </Modal>
    </div>
  );
};

export default ModalImportTemplate;
