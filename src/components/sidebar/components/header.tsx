import React from "react";
import SelectDocument from "./selectDocument";

const Header = ({ setModal }) => {
  return (
    <div className="mx-auto w-full font-bold text-xl flex items-center justify-between">
      <SelectDocument />
      <div
        onClick={() => setModal(true)}
        className="px-5 hover:bg-gray-500 transition-all duration-500 cursor-pointer h-10 rounded-full text-base font-normal bg-gray-700 text-white flex items-center justify-center"
      >
        Import
      </div>
    </div>
  );
};

export default Header;
