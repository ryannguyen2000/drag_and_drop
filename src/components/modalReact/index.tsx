import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";
import Modal from "react-modal";

type InactiveFooterProps = {
  isFooter: false;
};

type ActiveFooterProps = {
  isFooter?: true;
  footerClassName?: string;
  onCancel?: () => void;
  onSubmit?: () => void;
  loading?: boolean;
};

type CombineFooterProps = InactiveFooterProps | ActiveFooterProps;

type ModalV2Props = {
  children: React.ReactNode;
  onToggleModal: () => void;
  isOpen: boolean;
} & CombineFooterProps;

const ModalReact = ({
  children,
  onToggleModal,
  isOpen,
  ...props
}: ModalV2Props) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onToggleModal}
      contentLabel="Modal"
      className="root-modal animate-fade min-w-[500px]"
      shouldCloseOnOverlayClick={true}
    >
      {children}
      <div className="w-full flex justify-end gap-4">
        <button
          type="button"
          onClick={() => onToggleModal()}
          className="w-fit rounded-xl border px-5 py-2.5 text-sm text-gray-800 shadow-sm transition-all duration-500 hover:bg-slate-100"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={(props as ActiveFooterProps).loading}
          onClick={() => (props as ActiveFooterProps).onSubmit()}
          className={`${
            (props as ActiveFooterProps).loading &&
            "pointer-events-none select-none"
          } w-fit rounded-xl border bg-green-600 px-5 py-2.5 text-sm text-white shadow-sm transition-all duration-500 hover:bg-green-500`}
        >
          {(props as ActiveFooterProps).loading ? (
            <Icon
              icon="ph:circle-notch"
              fontSize={16}
              className="animate-spin"
            />
          ) : (
            "Submit"
          )}
        </button>
      </div>
    </Modal>
  );
};

export default ModalReact;
