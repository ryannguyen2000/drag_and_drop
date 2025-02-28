import { Icon } from "@iconify/react/dist/iconify.js";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";

import HueAnimate from "../../components/hue-animate";
import { GetData } from "../../apis";
import { setListProjects } from "../../store/ProjectSlice";
import Grid from "../../components/background/gridBackground";
import ListProject from "./listProject";
import ModalCreateProject from "./listProject/modalCreateProject";

const HomePage = () => {
  const [openProjectModal, setOpenProjectModal] = useState(false);

  const [getLoading, setGetLoading] = useState(false);

  const dispatch = useDispatch();

  const fetchDataProjects = async () => {
    setGetLoading(true);
    try {
      const response = (await GetData(
        `${import.meta.env.VITE__API_HOST}/api/projects`
      )) as any;
      if (response) {
        dispatch(setListProjects(response));
      }
    } catch (error) {
    } finally {
      setGetLoading(false);
    }
  };

  useEffect(() => {
    fetchDataProjects();
  }, []);

  useEffect(() => {
    if (getLoading) {
      const to = setTimeout(() => {
        setGetLoading(false);
      }, 10000);
      return () => {
        clearTimeout(to);
      };
    }
  }, [getLoading]);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <Grid size={200}>
        <ModalCreateProject
          fetchDataProjects={fetchDataProjects}
          openProjectModal={openProjectModal}
          setOpenProjectModal={setOpenProjectModal}
        />
        <HueAnimate
          growthX="70%"
          growthY="70%"
          positionX="-10%"
          positionY="110%"
        />
        <HueAnimate
          growthX="70%"
          growthY="70%"
          positionX="100%"
          positionY="0%"
        />

        <div className="w-full min-w-[1200px] h-screen relative pl-12 pb-12 pt-6 grid grid-cols-12 gap-48 overflow-hidden z-10">
          <div className="w-full col-span-7 h-[calc(100vh-10rem)] mt-12 overflow-y-scroll scrollbar-none">
            <div className=" w-full h-fit grid grid-cols-4 gap-4 p-6">
              <ListProject />
            </div>
          </div>
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

              <div className="absolute bg-white cursor-pointer shadow-lg border border-gray-100 w-16 h-16 rounded-full top-[30%] -translate-x-[25%] -translate-y-[50%] flex items-center justify-center hover:scale-125 transition-all duration-500 group">
                <Icon
                  icon="ph:dots-three"
                  fontSize={24}
                  className="group-hover:rotate-180 transition-all duration-300 ease-linear absolute"
                />
                <div className="pointer-events-none relative bg-white text-nowrap px-4 py-3 rounded-xl group-hover:scale-75 transition-all duration-500 shadow-lg right-[100%] group-hover:right-[150%] opacity-0 group-hover:opacity-100 ">
                  More info
                </div>
              </div>
              <div
                onClick={() => setOpenProjectModal(true)}
                className="absolute bg-white shadow-lg cursor-pointer border border-gray-100 w-16 h-16 rounded-full top-[40%] -translate-x-[52%] -translate-y-[50%] flex items-center justify-center hover:scale-125 transition-all duration-500 group"
              >
                <Icon
                  icon="ph:plus"
                  fontSize={24}
                  className="group-hover:rotate-180 transition-all duration-300 ease-linear absolute"
                />
                <div className="pointer-events-none relative bg-white text-nowrap px-4 py-3 rounded-xl group-hover:scale-75 transition-all duration-500 shadow-lg right-[150%] group-hover:right-[200%] opacity-0 group-hover:opacity-100 ">
                  Create new project
                </div>
              </div>
              <div className="absolute bg-white shadow-lg cursor-pointer border border-gray-100 w-16 h-16 rounded-full top-[50%] -translate-x-[52%] -translate-y-[50%] flex items-center justify-center hover:scale-125 transition-all duration-500 group">
                <Icon
                  icon="ph:gear"
                  fontSize={24}
                  className="group-hover:rotate-180 transition-all duration-300 ease-linear absolute"
                />
                <div className="pointer-events-none relative bg-white text-nowrap px-4 py-3 rounded-xl group-hover:scale-75 transition-all duration-500 shadow-lg right-[100%] group-hover:right-[150%] opacity-0 group-hover:opacity-100 ">
                  Settings
                </div>
              </div>
            </div>
          </div>
        </div>
      </Grid>
    </div>
  );
};

export default HomePage;
