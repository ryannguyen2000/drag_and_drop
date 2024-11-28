import {Icon} from "@iconify/react/dist/iconify.js";
import React, {FC, ReactNode} from "react";

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

type ModalMainProps = {
  open: boolean;
  onClose?: () => void;
  className?: string;
  title?: string;
  children?: ReactNode;
} & CombineFooterProps;

const Modal: FC<ModalMainProps> = ({
  open,
  children,
  className = "",
  onClose,
  title,
  isFooter = false,
  ...footerProps
}) => {
  return (
    <>
      {open && (
        <div
          className="flex items-center justify-center top-0 left-0 animate-fade fixed z-[900] w-screen h-screen bg-black/30"
          onClick={() => onClose()}
        >
          <div
            className={`p-6 bg-white rounded-2xl w-full max-w-96 aspect-video animate-delay-200 animate-fade-up ${className}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex mb-6 items-center justify-between font-semibold">
              {title}
              <Icon
                icon="ph:x-light"
                className="cursor-pointer"
                fontSize={24}
                onClick={() => onClose()}
              />
            </div>
            {children}
            {isFooter && (
              <div
                className={`w-full py-4 ${
                  (footerProps as ActiveFooterProps).footerClassName
                }`}
              >
                <button
                  type="button"
                  onClick={() => (footerProps as ActiveFooterProps).onCancel()}
                  className="w-fit rounded-xl border px-5 py-2.5 text-sm text-gray-800 shadow-sm transition-all duration-500 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={(footerProps as ActiveFooterProps).loading}
                  onClick={() => (footerProps as ActiveFooterProps).onSubmit()}
                  className={`${
                    (footerProps as ActiveFooterProps).loading &&
                    "pointer-events-none select-none"
                  } w-fit rounded-xl border bg-green-600 px-5 py-2.5 text-sm text-white shadow-sm transition-all duration-500 hover:bg-green-500`}
                >
                  {(footerProps as ActiveFooterProps).loading ? (
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
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
