import React, {FC} from "react";
import {useNavigate} from "react-router-dom";
import HueAnimate from "../../components/hue-animate";
import {Background} from "../../assets/images";
import {Icon} from "@iconify/react/dist/iconify.js";
import {colors} from "../../config/common";

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <HueAnimate />
      <div className="w-full min-w-[1200px] h-screen relative px-12 pb-12 pt-6 grid grid-cols-12 gap-48 overflow-hidden z-10">
        {/* <div className="relative w-full   h-fit before:content[] before:absolute before:w-full before:h-7 before:bg-gradient-to-t before:from-black/5 before:to-transparent before:pointer-events-none before:select-none before:bottom-0 before:left-0"> */}
        <div className="w-full col-span-7 h-[calc(100vh-10rem)] mt-12 overflow-y-scroll scrollbar-thin">
          <div className=" w-full h-fit grid grid-cols-4 gap-4 p-6">
            <div className="flex flex-col gap-2 w-full h-full p-4 aspect-[1.2] overflow-hidden rounded-[2rem] hover:scale-105 hover:border-blue-400 border cursor-pointer bg-white shadow-lg transition-all duration-500 hover:z-10">
              <img
                src={``}
                className="rounded-xl object-center object-cover bg-slate-50 w-full aspect-[2.5]"
                alt=""
                loading="lazy"
                crossOrigin="anonymous"
              />
              {/* <div className="rounded-xl object-center object-cover bg-slate-50 w-full aspect-[2.5]" /> */}
              <h2 className="text-base font-semibold line-clamp-1">
                This is the title
              </h2>
              <p className="text-xs line-clamp-1 text-gray-500">
                This is the description
              </p>
              <a
                href=""
                className="text-xs hover:underline text-gray-300 line-clamp-1 w-fit"
              >
                This is the url
              </a>
            </div>
            {/* More project here */}
          </div>
        </div>
        {/* </div> */}
        <div className="col-start-9 col-span-4 relative ">
          <div className="w-full h-[calc(100vh+10rem)] bg-white border-l border-gray-100 shadow-xl right-0 absolute rounded-tl-[80%] rounded-bl-[80%] top-1/2 -translate-y-1/2">
            <div className="absolute top-[10%] w-full flex flex-col items-center">
              <div className="w-fit">
                <span className={`text-c1 font-bold text-[3rem] contrast-75`}>
                  TEK
                </span>
                <span className={`text-c2 font-bold text-[3rem] contrast-75`}>
                  NIX
                </span>
              </div>
              <h3 className="w-fit font-semibold text-lg -mt-3">
                Innovate The Future
              </h3>
              <p className="max-w-52 text-center leading-8 text-gray-300 font-extralight mt-16 text-[1rem] tracking-tight">
                The UI component layout organizer allows for easy and flexible
                arrangement, alignment, and optimization of interface layouts
                through drag-and-drop, resizing, or visual component
                positioning.
              </p>
            </div>
            <div className="absolute bottom-[10%] w-full flex flex-col items-center">
              <span className="text-sm text-gray-500 underline text-center">
                TEKNIX Corporation Copyright &copy;
              </span>
            </div>

            <div className="absolute bg-white cursor-pointer shadow-lg border border-gray-100 w-16 h-16 rounded-full top-[40%] -translate-x-[44%] -translate-y-[50%] flex items-center justify-center hover:scale-125 transition-all duration-500 group">
              <Icon
                icon="ph:dots-three"
                fontSize={24}
                className="group-hover:rotate-180 transition-all duration-300 ease-linear absolute"
              />
              <div className="relative bg-white text-nowrap px-4 py-3 rounded-xl group-hover:scale-75 transition-all duration-500 shadow-lg right-[100%] group-hover:right-[150%] opacity-0 group-hover:opacity-100 ">
                More info
              </div>
            </div>
            <div className="absolute bg-white shadow-lg cursor-pointer border border-gray-100 w-16 h-16 rounded-full top-[50%] -translate-x-[52%] -translate-y-[50%] flex items-center justify-center hover:scale-125 transition-all duration-500 group">
              <Icon
                icon="ph:plus"
                fontSize={24}
                className="group-hover:rotate-180 transition-all duration-300 ease-linear absolute"
              />
              <div className="relative bg-white text-nowrap px-4 py-3 rounded-xl group-hover:scale-75 transition-all duration-500 shadow-lg right-[150%] group-hover:right-[200%] opacity-0 group-hover:opacity-100 ">
                Create new project
              </div>
            </div>
            <div className="absolute bg-white shadow-lg cursor-pointer border border-gray-100 w-16 h-16 rounded-full top-[60%] -translate-x-[44%] -translate-y-[50%] flex items-center justify-center hover:scale-125 transition-all duration-500 group">
              <Icon
                icon="ph:gear"
                fontSize={24}
                className="group-hover:rotate-180 transition-all duration-300 ease-linear absolute"
              />
              <div className="relative bg-white text-nowrap px-4 py-3 rounded-xl group-hover:scale-75 transition-all duration-500 shadow-lg right-[100%] group-hover:right-[150%] opacity-0 group-hover:opacity-100 ">
                Settings
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <button onClick={() => navigate("/editor")}>Go editor</button> */}
    </div>
  );
};

export default HomePage;
