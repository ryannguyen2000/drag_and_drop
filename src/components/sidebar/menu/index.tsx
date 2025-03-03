import { Icon } from "@iconify/react/dist/iconify.js";
import _ from "lodash";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { setMenuSelected } from "../../../store/sidebar";
import { RootState } from "../../../store";
import MenuDetail from "./MenuDetail";

const menus = [
  {
    value: 1,
    label: "Page selector",
    icon: (
      <Icon
        icon="emojione-v1:page"
        className="transition-all group-hover:translate-x-1 group-hover:scale-110"
      />
    ),
  },
  {
    value: 2,
    label: "Widget Tree",
    icon: (
      <Icon
        icon="tabler:list-tree"
        className="transition-all group-hover:translate-x-1 group-hover:scale-110"
      />
    ),
  },
  {
    value: 3,
    label: "Widgets",
    icon: (
      <Icon
        icon="mingcute:baseball-2-fill"
        className="transition-all group-hover:translate-x-1 group-hover:scale-110"
      />
    ),
  },
  {
    value: 4,
    label: "Custom Widgets",
    icon: (
      <Icon
        icon="carbon:chart-custom"
        className="transition-all group-hover:translate-x-1 group-hover:scale-110"
      />
    ),
  },
  {
    value: 5,
    label: "Setting",
    icon: (
      <Icon
        icon="uil:setting"
        className="transition-all group-hover:translate-x-1 group-hover:scale-110"
      />
    ),
  },
];

const selector = (state: RootState) => [state.sidebar];

const Menu = () => {
  const dispatch = useDispatch();
  const [sidebarState] = useSelector(selector, shallowEqual);

  return (
    <div className="flex text-[12px]">
      <div className="pt-4 p-2 flex flex-col gap-1 bg-[#14181b] h-[calc(100vh)] text-white border-r-[1px] border-[#465158] z-[2]">
        {_.map(menus, (m) => {
          const isActive = m.value === sidebarState.menuSelected;
          return (
            <button
              key={m.value}
              className={`group p-2 hover:bg-slate-400 rounded-md cursor-pointer relative ${
                isActive ? "bg-slate-400" : ""
              }`}
              onClick={() => dispatch(setMenuSelected(Number(m.value)))}
            >
              <div className="absolute left-full ml-2 bg-black text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {m.label}
              </div>
              {m.icon}
            </button>
          );
        })}
      </div>
      <MenuDetail id={sidebarState.menuSelected} />
    </div>
  );
};

export default Menu;
