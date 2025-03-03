import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";

import {
  setActiveWidgetId,
  setDataCustomWidget,
} from "../../../../store/DndWidget";
import { RootState } from "../../../../store";

const ListCustomWidgets = ({ data }) => {
  const { listWidgetElements, activeWidgetId } = useSelector(
    (state: RootState) => state.dndWidgets
  );

  return (
    <div className="flex flex-col gap-3">
      {_.map(data, (d) => (
        <Item key={d._id} item={d} listWidgetElements={listWidgetElements} />
      ))}
    </div>
  );
};

const Item = ({
  item,
  listWidgetElements,
}: {
  item: any;
  listWidgetElements: any;
}) => {
  const dispatch = useDispatch();

  const handleActive = async (value: string) => {
    const contentWidgetSelected = _.find(listWidgetElements, { _id: value });
    dispatch(setActiveWidgetId(value));
    dispatch(
      setDataCustomWidget({ data: _.get(contentWidgetSelected, "content", "") })
    );
  };

  return (
    <button
      onClick={() => handleActive(item._id)}
      className="p-4 rounded-xl flex justify-start items-center border-[0.5px] w-[180px] hover:bg-slate-700 focus:border-blue-400"
    >
      <div className="text-center text-sm truncate line-clamp-2">
        {_.get(item, "name")}
      </div>
    </button>
  );
};

export default ListCustomWidgets;
