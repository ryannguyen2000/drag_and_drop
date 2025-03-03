import { ChangeEvent, useState } from "react";

import Modal from "../../../components/modal";
import { ToastError, ToastSuccess } from "../../../components/toast";
import { PostData } from "../../../apis";

const ModalCreateProject = ({
  openProjectModal,
  setOpenProjectModal,
  fetchDataProjects,
}) => {
  const [projectName, setProjectName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [projectImage, setProjectImage] = useState<any>();

  const [createLoading, setCreateLoading] = useState(false);

  const handleSubmitCreateProject = async () => {
    if (!projectName) {
      ToastError({ msg: "Please fill all fields" });
      return;
    }
    const formData = {
      projectName: projectName,
      thumbnail: "",
      websiteUrl: websiteUrl.trim(),
    };
    setCreateLoading(true);
    try {
      const response = await PostData(
        `${import.meta.env.VITE__API_HOST}/api/projects`,
        formData
      );
      if (response) {
        fetchDataProjects();
        ToastSuccess({ msg: "Projects created successfully" });
        setOpenProjectModal(!openProjectModal)
      }
    } catch (error) {
    } finally {
      setCreateLoading(false);
    }
  };

  const handleImageImport = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setProjectImage(file);
      } catch (error) {
        //
      }
    }
  };

  return (
    <Modal
      open={openProjectModal}
      onClose={() => setOpenProjectModal(false)}
      title="Create project"
      isFooter
      loading={createLoading}
      onCancel={() => setOpenProjectModal(false)}
      onSubmit={() => handleSubmitCreateProject()}
      className="max-w-lg"
      footerClassName="flex gap-4 justify-end"
    >
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col">
          <label
            htmlFor="name-input"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Project Name<span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            id="name-input"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Your project name"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 h-10  "
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="name-input"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            thumbnail
          </label>
          <label htmlFor="input" className="w-full cursor-pointer">
            <div className="border w-full overflow-hidden rounded-lg h-10 bg-white grid grid-cols-3 ">
              <div className=" bg-slate-100 flex items-center justify-center text-sm col-span-1">
                Browse
              </div>
              <div className="flex items-center justify-start px-2 text-gray-400 text-sm text-nowrap col-span-2  w-full">
                <span className="!truncate">{"No file choose"}</span>
              </div>
            </div>
            <input
              type="file"
              hidden
              id="input"
              accept=".png,.jpg,.jpeg"
              onChange={(e) => handleImageImport(e)}
            />
          </label>
        </div>
      </div>
      <div className="mb-4">
        <label
          htmlFor="wurl-input"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Website Url
        </label>
        <input
          type="text"
          id="wurl-input"
          value={websiteUrl}
          onChange={(e) => setWebsiteUrl(e.target.value)}
          placeholder="YOUR_WEBSITE_URL_TO_APPLY_THIS_LAYOUT"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 h-10 "
        />
      </div>
    </Modal>
  );
};

export default ModalCreateProject;
