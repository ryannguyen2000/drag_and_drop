import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { RootState } from "../../../store";
import { SaveACookie } from "../../../utilities/cookies";
import { EncryptBasic } from "../../../utilities/hash_aes";
import { Enum } from "../../../config/common";
import {
  setDocumentName,
  setUID,
} from "../../../store/documents/documentSlice";

const SelectDocument = () => {
  const dispatch = useDispatch();
  const { listDocument, uid } = useSelector(
    (state: RootState) => state.documentSlice
  );

  const [search, setSearch] = useState(""); // Trạng thái tìm kiếm
  const [isOpen, setIsOpen] = useState(false); // Trạng thái dropdown
  const dropdownRef = useRef(null); // Ref để theo dõi click ngoài dropdown

  // Lấy tài liệu hiện tại dựa vào UID
  const selectedDocument = listDocument.find((doc) => doc.uid === uid);
  const selectedDocumentName = selectedDocument?.documentName || "";

  // Khi input được focus hoặc gõ tìm kiếm, danh sách sẽ lọc lại
  const filteredDocuments = listDocument.filter((doc) =>
    doc.documentName.toLowerCase().includes(search.toLowerCase())
  );

  function navigationEditor(document): void {
    SaveACookie({
      key: "did",
      token: EncryptBasic(document.documentId, Enum.srkey).toString(),
      expired: 1,
    });
  }

  const onSelect = (document) => {
    dispatch(setDocumentName(document.documentName));
    dispatch(setUID(document.uid));
    navigationEditor(document);

    setSearch(document.documentName); // Cập nhật input với tên tài liệu được chọn
    setIsOpen(false); // Ẩn dropdown sau khi chọn
  };

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        if (search === "") {
          setSearch(selectedDocumentName);
        }
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cập nhật input khi `uid` thay đổi (từ Redux store)
  useEffect(() => {
    setSearch(selectedDocumentName);
  }, [uid]);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Ô tìm kiếm (hiển thị tài liệu đang chọn ban đầu) */}
      <input
        type="text"
        placeholder="Tìm kiếm tài liệu..."
        className="w-full p-2 border rounded focus:outline-none"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onFocus={() => setIsOpen(true)}
      />

      {/* Dropdown danh sách tài liệu */}
      {isOpen && (
        <div className="absolute z-10 w-full bg-white border rounded shadow-lg max-h-48 overflow-y-auto mt-1">
          {filteredDocuments.length > 0 ? (
            filteredDocuments.map((item) => (
              <div
                key={item._id}
                className={`p-2 cursor-pointer hover:bg-gray-100 ${
                  item.uid === uid ? "bg-gray-200 font-semibold" : ""
                }`}
                onClick={() => onSelect(item)}
              >
                {item.documentName}
              </div>
            ))
          ) : (
            <div className="p-2 text-gray-500">Không tìm thấy tài liệu</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SelectDocument;
