import { Icon } from "@iconify/react/dist/iconify.js";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ShiningButton from "../../../components/button/shiningButton";
import ResponsiveModalDrawer from "../../../components/modal/responsiveModalDrawer";
import { RootState } from "../../../store";

type SaveDocumentModalDrawerType = {};

export const SaveDocumentModal = (props: SaveDocumentModalDrawerType) => {
  const documentState = useSelector((state: RootState) => state.documentSlice);
  const dispatch = useDispatch();

  // State for inputs
  const [opened, setOpened] = useState(false);
  const [documentName, setDocumentName] = useState("");
  const [category, setCategory] = useState("");
  const [errors, setErrors] = useState({ documentName: "", category: "" });

  const handleOnCloseModal = () => setOpened(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      documentName: documentName ? "" : "Document Name is required",
      category: category ? "" : "Please select a category",
    };

    setErrors(newErrors);

    if (!newErrors.documentName && !newErrors.category) {
      console.log("Form Submitted", { documentName, category });
      // Handle submission logic
    }
  };

  return (
    <ResponsiveModalDrawer
      title="Save Document"
      opened={opened}
      onClose={handleOnCloseModal}
      openButton={
        <ShiningButton
          icon={
            <Icon icon="ph:plus-thin" className="size-8 font-bold text-white" />
          }
          buttonWrapperClassName="!rounded-full"
          buttonClassName="!rounded-full !bg-neutral-800 !text-black !px-2 !py-1 !text-white"
          onClick={() => setOpened(true)}
        />
      }
      showFooter={false}
    >
      <form className="space-y-6 p-4" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="documentName"
            className="block text-sm font-medium text-gray-700"
          >
            Document Name
          </label>
          <div className="mt-1 relative">
            <input
              type="text"
              id="documentName"
              placeholder="Enter document name"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              className={`block w-full rounded-md border p-2.5 shadow-sm sm:text-sm ${
                errors.documentName
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              }`}
              required
            />
            <Icon
              icon="mdi:file-document-outline"
              className="absolute right-3 top-3 text-gray-400"
            />
          </div>
          {errors.documentName && (
            <p className="mt-1 text-sm text-red-500">{errors.documentName}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700"
          >
            Select Document
          </label>
          <div className="mt-1 relative">
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`block w-full rounded-md border p-2.5 shadow-sm sm:text-sm ${
                errors.category
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              }`}
              required
            >
              <option value="" disabled>
                Select a category
              </option>
              <option value="reports">Reports</option>
              <option value="invoices">Invoices</option>
              <option value="contracts">Contracts</option>
            </select>
            <Icon
              icon="mdi:chevron-down"
              className="absolute right-3 top-3 text-gray-400"
            />
          </div>
          {errors.category && (
            <p className="mt-1 text-sm text-red-500">{errors.category}</p>
          )}
        </div>

        <div className="flex flex-col items-start justify-start gap-2 mt-10">
          <button
            type="submit"
            className="w-full rounded-md bg-neutral-800 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black focus:outline-none focus:ring-2 focus:ring-black"
          >
            Save
          </button>
          <button
            type="button"
            className="w-full rounded-md bg-white px-4 py-2 text-sm font-semibold text-black border border-black"
            onClick={() => setOpened(false)}
          >
            Close
          </button>
        </div>
      </form>
    </ResponsiveModalDrawer>
  );
};
