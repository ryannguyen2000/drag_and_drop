import { Icon } from "@iconify/react/dist/iconify.js";
import clsx from "clsx";
import { useState } from "react";

export const HeaderDropdown = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Drawer */}
      <div
        className={clsx(
          "fixed top-0 bottom-0 right-0 bg-black z-30 w-[40vw] transition-transform duration-300 ease-in-out",
          open ? "h-screen" : "h-0"
        )}
      >
        <div className="flex items-center justify-between p-4 bg-red-800">
          <span className="text-white text-lg font-bold">Drawer Header</span>
          <Icon
            icon="iwwa:delete"
            className="text-white size-24 cursor-pointer"
            onClick={() => setOpen(false)}
          />
        </div>
        <div className="p-4 text-white">
          <p>Drawer content goes here...</p>
        </div>
      </div>

      {/* Trigger Button */}
      <button onClick={() => setOpen(true)} className="fixed top-4 right-4">
        <Icon
          icon={open ? "iwwa:delete" : "fluent:navigation-20-regular"}
          className="text-dark size-16"
        />
      </button>
    </>
  );
};
