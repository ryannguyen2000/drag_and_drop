import { Icon } from "@iconify/react/dist/iconify.js";
import clsx from "clsx";
import React from "react";
import ReactDOM from "react-dom";

type ResponsiveModalDrawerType = {
  title?: string;
  opened: boolean;
  onClose: () => void;
  openButton?: React.ReactNode;
  children?: React.ReactNode;
  showFooter?: boolean;
  confirmAction?: () => void | any;
  confirmButtonStyles?: string;
};

const ResponsiveModalDrawer = React.memo((props: ResponsiveModalDrawerType) => {
  // props
  const {
    title,
    opened,
    onClose,
    openButton,
    children,
    showFooter = true,
    confirmAction,
    confirmButtonStyles,
  } = props;

  const ModalHeader = () => (
    <div className="flex justify-between items-center gap-3">
      <div className="text-lg font-medium">{title || "Modal Header"}</div>
      <Icon
        icon="mdi:remove"
        className="size-7 cursor-pointer"
        onClick={() => onClose()}
      />
    </div>
  );

  const ModalFooter = () => (
    <div className="flex justify-end items-center gap-3 ml-auto">
      <button
        onClick={() => onClose()}
        className="mt-4 px-4 py-2 border border-neutral-600 bg-transparent text-black rounded-md font-medium hover:bg-neutral-100"
      >
        Close
      </button>
      <button
        onClick={() => {
          confirmAction && confirmAction();
          onClose();
        }}
        className={clsx(
          "mt-4 px-4 py-2 bg-red-500 text-white rounded-md",
          confirmButtonStyles
        )}
      >
        Confirm
      </button>
    </div>
  );

  // Modal content to render using React Portal
  const ModalContent = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/30"
        onClick={() => onClose()}
      ></div>

      {/* Modal for Desktop */}
      <div
        className={`
          hidden lg:block 
          bg-white rounded-lg shadow-lg p-6 w-[30rem] max-w-full transition-all duration-200 ease-in-out animate-fade-down
          transform ${opened ? "scale-100 opacity-100" : "scale-95 opacity-0"}
        `}
      >
        <ModalHeader />
        {/* Content */}
        <div className="my-5">{children}</div>

        {/* Footer */}
        {showFooter && <ModalFooter />}
      </div>

      {/* Drawer for Mobile */}
      <div
        className={`
          lg:hidden 
          fixed bottom-0 left-0 right-0 
          bg-white rounded-t-xl shadow-lg p-6 w-full max-h-[90vh] overflow-y-auto duration-150 transition-all ease-in-out animate-fade-up
          transform ${
            opened ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
          }
        `}
      >
        <ModalHeader />

        {/* Content */}
        <div className="my-5">{children}</div>

        {/* Footer */}
        {showFooter && <ModalFooter />}
      </div>
    </div>
  );

  return (
    <div>
      {/* Button to toggle modal/drawer */}
      <div>{openButton}</div>

      {/* Render ModalContent via Portal */}
      {opened && ReactDOM.createPortal(<ModalContent />, document.body)}
    </div>
  );
});

ResponsiveModalDrawer.displayName = "ResponsiveModalDrawer";
export default ResponsiveModalDrawer;
