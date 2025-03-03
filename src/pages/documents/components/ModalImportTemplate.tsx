import { Icon } from "@iconify/react/dist/iconify.js";
import { useEffect, useState } from "react";
import _ from "lodash";

import axiosInstance from "../../../apis/axiosInstance";
import ShiningButton from "../../../components/button/shiningButton";
import { ToastSuccess } from "../../../components/toast";
import { DecryptBasic } from "../../../utilities/hash_aes";
import { GetACookie } from "../../../utilities/cookies";
import { Enum } from "../../../config/common";
import ModalReact from "../../../components/modalReact";

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
        targetRepo: "teknix-nextjs-test-1",
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
          Add Template
        </div>
      </div>
      <ModalReact
        isOpen={isOpen}
        onToggleModal={onToggleModal}
        onSubmit={onSave}
      >
        <h4 className="font-bold">Add templates for all pages</h4>
        <div className="flex flex-col gap-2 mt-4">
          <div className="flex flex-col gap-2 h-full min-h-[20rem] max-h-[25rem]">
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
        </div>
      </ModalReact>
    </div>
  );
};

export default ModalImportTemplate;
