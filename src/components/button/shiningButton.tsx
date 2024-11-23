import { Icon } from "@iconify/react/dist/iconify.js";
import clsx from "clsx";
import React from "react";

type ShiningButtonType = {
  icon?: React.ReactNode;
  label?: string;
  buttonClassName?: string;
  buttonWrapperClassName?: string;
  onClick?: () => void;
};

export default function ShiningButton(props: ShiningButtonType) {
  const { icon, label, buttonClassName, buttonWrapperClassName, onClick } =
    props;
  return (
    <button
      className={clsx(
        "group cursor-pointer rounded-xl border-4 border-neutral-700 border-opacity-0 bg-transparent p-1 transition-all duration-500 hover:border-opacity-100",
        buttonWrapperClassName
      )}
      onClick={onClick}
    >
      <div
        className={clsx(
          "relative flex items-center justify-center gap-4 overflow-hidden rounded-lg bg-violet-800 px-6 py-4 font-bold text-white",
          buttonClassName
        )}
      >
        {label}
        {icon ? (
          icon
        ) : (
          <Icon
            icon="formkit:arrowright"
            className="transition-all group-hover:translate-x-2 group-hover:scale-125"
          />
        )}
        <div
          className={clsx(
            "absolute -left-16 top-0 h-full w-12 rotate-[30deg] scale-y-150 bg-white/10 transition-all duration-700 group-hover:left-[calc(100%+1rem)]"
          )}
        />
      </div>
    </button>
  );
}
