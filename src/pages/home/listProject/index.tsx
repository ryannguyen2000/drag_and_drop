import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MouseEvent, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

import { RootState } from "../../../store";
import { ContextMenu } from "../../../components/context-menu";
import { SaveACookie } from "../../../utilities/cookies";
import { EncryptBasic } from "../../../utilities/hash_aes";
import { Enum } from "../../../config/common";
import { DeleteData, GetData } from "../../../apis";
import { ToastSuccess } from "../../../components/toast";
import { setListProjects } from "../../../store/ProjectSlice";
import CardSkeleton from "../../../components/skeleton";

const ListProject = () => {
  const navigate = useNavigate();

  const { projectList } = useSelector((state: RootState) => state.projects);
  const dispatch = useDispatch();

  const [getLoading, setGetLoading] = useState(false);

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

  const handleClickProject = (id: string) => {
    SaveACookie({
      key: "pid",
      token: EncryptBasic(id, Enum.srkey).toString(),
      expired: 1,
    });
    navigate("/documents");
  };

  const handleNavigateProjectUrl = (
    e: MouseEvent<HTMLSpanElement>,
    projectUrl: string
  ) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(projectUrl, "_blank");
  };

  const handleDeleteProject = async (id: any) => {
    const response = await DeleteData(
      `${import.meta.env.VITE__API_HOST}/api/projects/${id}`
    );
    if (response) {
      fetchDataProjects();
      ToastSuccess({ msg: "Project deleted successfully" });
    }
  };

  return !getLoading ? (
    <>
      {projectList?.length > 0 ? (
        projectList?.map((project, index) => (
          <ContextMenu
            id={project._id}
            key={index}
            triggerElement={
              <div
                key={index}
                onClick={() => handleClickProject(project?.projectId)}
                className="flex relative flex-col gap-2 w-full h-full p-4 aspect-[1.2] overflow-hidden hover:shadow-xl rounded-[2rem] hover:scale-105 hover:border-blue-400 border cursor-pointer bg-white shadow-md transition-all duration-500 hover:z-10"
              >
                <img
                  src={``}
                  className="rounded-xl object-center object-cover bg-slate-50 w-full aspect-[2.5]"
                  alt=""
                  loading="lazy"
                  crossOrigin="anonymous"
                />
                <h2 className="text-base font-semibold line-clamp-1">
                  {project?.projectName}
                </h2>
                <p className="text-xs line-clamp-1 text-gray-500">
                  {project?.createdAt &&
                    new Date(project?.createdAt).toLocaleString()}
                </p>
                <span
                  onClick={(e) =>
                    handleNavigateProjectUrl(e, project?.projectUrl)
                  }
                  className="text-xs hover:underline text-gray-300 line-clamp-1 w-fit"
                >
                  {project?.projectUrl}
                </span>
                <Icon
                  icon="ph:mouse-right-click-fill"
                  fontSize={16}
                  className="bottom-5 right-5 absolute opacity-30"
                />
              </div>
            }
            options={[
              {
                label: "Delete",
                handle: () => handleDeleteProject(project?.projectId),
                className: "!bg-red-400",
                icon: <Icon icon="ph:trash-simple" fontSize={20} />,
              },
            ]}
          />
        ))
      ) : (
        <h1 className="col-span-12 text-center text-gray-300 font-bold text-xl">
          No project found
        </h1>
      )}
    </>
  ) : (
    <CardSkeleton count={4} size={3} />
  );
};

export default ListProject;
