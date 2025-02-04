import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";

import { RootState } from "../../store";
import { setDocumentName, setUID } from "../../store/documents/documentSlice";
import { SaveACookie } from "../../utilities/cookies";
import { EncryptBasic } from "../../utilities/hash_aes";
import { Enum } from "../../config/common";

const SelectDocument = () => {
  const dispatch = useDispatch();

  const { listDocument, uid } = useSelector(
    (state: RootState) => state.documentSlice
  );

  function navigationEditor(document): void {
    SaveACookie({
      key: "did",
      token: EncryptBasic(document.documentId, Enum.srkey).toString(),
      expired: 1,
    });
  }

  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUid = event.target.value;
    const document =
      _.find(listDocument, { uid: selectedUid }) ||
      _.find(listDocument, { _id: selectedUid });
    dispatch(setDocumentName(_.get(document, "documentName")));
    dispatch(setUID(_.get(document, "uid")));
    navigationEditor(document);
  };

  return (
    <select onChange={onChange} value={uid || ""} className="h-[30px]">
      {_.map(listDocument, (item) => (
        <option key={item._id} value={item.uid || item._id}>
          {item.documentName}
        </option>
      ))}
    </select>
  );
};

export default SelectDocument;
