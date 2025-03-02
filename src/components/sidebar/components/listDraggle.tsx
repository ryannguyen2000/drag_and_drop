import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import Draggable from "../../draggable";
import { GetData } from "../../../apis";
import { setDataElements } from "../../../store/DndWidget";
import { RootState } from "../../../store";

const formatDataForDraggle = (data) => {
  data = _.map(data, (item: any) => ({
    ...item,
    id: item?.sliceId,
    columns: "1",
    rows: "1",
    colspan: "1",
    rowspan: "1",
    gap: "1",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    type: "content",
    childs: [],
    style: {},
    thumbnail: item?.thumbnail || "",
  }));
  return data;
};

const ListDraggle = ({ lockScroll, groupedSide }) => {
  const { data, listWidgetElements } = useSelector(
    (state: RootState) => state.dndWidgets
  );
  const dispatch = useDispatch();

  const getElements = async () => {
    try {
      const response = await GetData(
        `${import.meta.env.VITE__API_HOST}/api/elements`
      );
      if (response) {
        let newData = _.get(response, "data", []);
        newData = _.map(newData, (item: any) => ({
          ...item,
          id: item?.sliceId,
          columns: "1",
          rows: "1",
          colspan: "1",
          rowspan: "1",
          gap: "1",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          type: "content",
          childs: [],
          style: {},
          thumbnail: item?.thumbnail || "",
        }));
        dispatch(setDataElements(newData));
      }
    } catch (error) {}
  };

  useEffect(() => {
    getElements();
  }, []);
  return (
    // Default Elements
    <div className="flex flex-col gap-9">
      <div className="flex flex-col gap-3 max-h-[400px] overflow-y-scroll pr-2 scrollbar-thin scrollbar-thumb-slate-500 scrollbar-track-transparent scrollbar-hide">
        {_.map(data, (item, index) => {
          return (
            <Draggable className="relative" {...item} key={index} id={item.id}>
              <div className="p-4 rounded-xl flex justify-start items-center border-[0.5px] w-[180px]">
                <div className="text-center text-sm truncate line-clamp-2">
                  {item.name}
                </div>
              </div>
            </Draggable>
          );
        })}
      </div>

      {/* Widgets Custom */}
      <div className="flex flex-col gap-3 max-h-[400px] overflow-y-scroll pr-2 scrollbar-thin scrollbar-thumb-slate-500 scrollbar-track-transparent scrollbar-hide">
        {_.map(formatDataForDraggle(listWidgetElements), (item, index) => {
          return (
            <Draggable className="relative" {...item} key={index} id={item.id}>
              <div className="p-4 rounded-xl flex justify-start items-center border-[0.5px] w-[180px]">
                <div className="text-center text-sm truncate line-clamp-2">
                  {item.name}
                </div>
              </div>
            </Draggable>
          );
        })}
      </div>

      <div
        id="accordion-flush"
        data-accordion="collapse"
        data-active-classes="bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
        data-inactive-classes="text-gray-500 dark:text-gray-400"
      >
        <h2 id="accordion-flush-heading-1">
          <button
            type="button"
            className="flex items-center justify-between w-full py-5 font-medium rtl:text-right text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400 gap-3"
            data-accordion-target="#accordion-flush-body-1"
            aria-expanded="true"
            aria-controls="accordion-flush-body-1"
          >
            <span>What is Flowbite?</span>
            <svg
              data-accordion-icon
              className="w-3 h-3 rotate-180 shrink-0"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5 5 1 1 5"
              />
            </svg>
          </button>
        </h2>
        <div
          id="accordion-flush-body-1"
          className="hidden"
          aria-labelledby="accordion-flush-heading-1"
        >
          <div className="py-5 border-b border-gray-200 dark:border-gray-700">
            <p className="mb-2 text-gray-500 dark:text-gray-400">
              Flowbite is an open-source library of interactive components built
              on top of Tailwind CSS including buttons, dropdowns, modals,
              navbars, and more.
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              Check out this guide to learn how to{" "}
              <a
                href="/docs/getting-started/introduction/"
                className="text-blue-600 dark:text-blue-500 hover:underline"
              >
                get started
              </a>{" "}
              and start developing websites even faster with components on top
              of Tailwind CSS.
            </p>
          </div>
        </div>
        <h2 id="accordion-flush-heading-2">
          <button
            type="button"
            className="flex items-center justify-between w-full py-5 font-medium rtl:text-right text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400 gap-3"
            data-accordion-target="#accordion-flush-body-2"
            aria-expanded="false"
            aria-controls="accordion-flush-body-2"
          >
            <span>Is there a Figma file available?</span>
            <svg
              data-accordion-icon
              className="w-3 h-3 rotate-180 shrink-0"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5 5 1 1 5"
              />
            </svg>
          </button>
        </h2>
        <div
          id="accordion-flush-body-2"
          className="hidden"
          aria-labelledby="accordion-flush-heading-2"
        >
          <div className="py-5 border-b border-gray-200 dark:border-gray-700">
            <p className="mb-2 text-gray-500 dark:text-gray-400">
              Flowbite is first conceptualized and designed using the Figma
              software so everything you see in the library has a design
              equivalent in our Figma file.
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              Check out the{" "}
              <a
                href="https://flowbite.com/figma/"
                className="text-blue-600 dark:text-blue-500 hover:underline"
              >
                Figma design system
              </a>{" "}
              based on the utility classes from Tailwind CSS and components from
              Flowbite.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListDraggle;
