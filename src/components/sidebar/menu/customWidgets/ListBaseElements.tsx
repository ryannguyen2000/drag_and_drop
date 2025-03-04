import _ from "lodash";
import { useDispatch } from "react-redux";
import { setDataCustomWidget } from "../../../../store/DndWidget";

const ListBaseElements = ({ data }) => {
  return (
    <div className="flex flex-col gap-3">
      {_.map(data, (d) => (
        <Item key={d._id} item={d} data={data} />
      ))}
    </div>
  );
};

const Item = ({ item, data }: { item: any; data: any }) => {
  const dispatch = useDispatch();

  const handleActive = async (value: string) => {
    const contentWidgetSelected = _.find(data, { _id: value });
    dispatch(setDataCustomWidget(value));
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

export default ListBaseElements;
