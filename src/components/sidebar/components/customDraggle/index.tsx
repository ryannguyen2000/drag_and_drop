import { Icon } from "@iconify/react/dist/iconify.js";
import { useDispatch } from "react-redux";
import { setIsCustomElement } from "../../../../store/DndWidget";

const CustomDraggle = () => {
  const dispatch = useDispatch();

  const onCustomElement = () => {
    dispatch(setIsCustomElement(true));
  };

  return (
    <div>
      <div className="">
        <button className="group p-2 rounded-md cursor-pointer relative flex gap-2" onClick={onCustomElement}>
          Custom Elements
          <Icon
            icon="mdi:plus-outline"
            className="transition-all group-hover:scale-125"
            width={20}
            height={20}
          />
        </button>
      </div>
    </div>
  );
};

export default CustomDraggle;
