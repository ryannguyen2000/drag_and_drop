import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { setMoveSliceParent } from "../../store/DndSlice";

const selector = (state: RootState) => [state.dndSlice];

const CheckboxMoveSlice = () => {
  const dispatch = useDispatch();

  const [dndSlice] = useSelector(selector, shallowEqual);
  const { moveSliceParent } = dndSlice;

  const onCheckbox = (e: { target: { checked: any } }) => {
    dispatch(setMoveSliceParent(e.target.checked));
  };

  return (
    <label className="flex items-center gap-2 mb-4">
      <input type="checkbox" checked={moveSliceParent} onChange={onCheckbox} />
      Di chuyển Grid/Flex
    </label>
  );
};

export default CheckboxMoveSlice;
