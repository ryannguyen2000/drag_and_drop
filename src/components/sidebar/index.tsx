import { useCallback, useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import _ from "lodash";

import { RootState } from "../../store";
import { setData, setSidebar } from "../../store/DndSlice";
import { GetData } from "../../apis";
import { DecryptBasic } from "../../utilities/hash_aes";
import { GetACookie } from "../../utilities/cookies";
import { Enum } from "../../config/common";
import BackToPage from "./backToPage";
import FrameBoxAndFlex from "./frame";
import ListDraggle from "./listDraggle";
import ModalAddJson from "./modalAddJson";
import Header from "./header";
import CheckboxMoveSlice from "../../pages/editor/checkboxMoveSlice";

const selector = (state: RootState) => [state.dndSlice, state.documentSlice];

const Sidebar = () => {
  const [dndSlice] = useSelector(selector, shallowEqual);
  const { data, lockScroll, sidebar, typeScreen } = dndSlice;

  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);

  const [groupedSide, setGroupedSide] = useState<any>([]);

  const getSlicesData = async () => {
    try {
      const response = (await GetData(
        `${import.meta.env.VITE__API_HOST}/api/slices?pId=${DecryptBasic(
          GetACookie("pid"),
          Enum.srkey
        )}&dId=${DecryptBasic(GetACookie("did"), Enum.srkey)}`
      )) as any;
      if (response) {
        return response?.map((item: any) => ({
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
      }
    } catch (error) {}
  };
  const getDocumentsData = async () => {
    try {
      const response = (await GetData(
        `${import.meta.env.VITE__API_HOST}/api/documents?dId=${DecryptBasic(
          GetACookie("did"),
          Enum.srkey
        )}`
      )) as any;
      if (response) {
        return response[0]?.layoutJson[0]?.data;
      }
    } catch (error) {
      //
    }
  };

  const getAllIdsFromData = (data: any) => {
    const ids: string[] = [];
    const traverse = (node: any) => {
      if (node.id) {
        ids.push(node.id);
      }
      if (node.childs && Array.isArray(node.childs)) {
        node.childs.forEach((child) => traverse(child));
      }
    };

    traverse(data);
    return ids;
  };

  useEffect(() => {
    if (data[typeScreen]) {
      const ids = getAllIdsFromData(data[typeScreen]);
    }
  }, [data, typeScreen]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getSlicesData();
      dispatch(setSidebar(result));
      const documentResult = await getDocumentsData();
      if (documentResult) {
        dispatch(setData(JSON.parse(documentResult)));
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const socket = io(
      "https://serverless-tn-layout-production.up.railway.app",
      {
        withCredentials: true,
        transports: ["websocket"],
      }
    );

    socket.on("webhook-data", async (data) => {
      const result = await getSlicesData();
      dispatch(setSidebar(result));
      const documentResult = await getDocumentsData();
      dispatch(setData(JSON.parse(documentResult)));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Hàm xử lý và nhóm sidebar
  const processSidebar = useCallback(() => {
    const ids = getAllIdsFromData(data[typeScreen]); // Lấy danh sách ids đã render
    const filteredSidebar = sidebar.filter((item) => !ids.includes(item.id)); // Loại bỏ object có id đã render

    const groupedSidebar = filteredSidebar.reduce((acc, item) => {
      const name = item.id.split("$")[0];
      if (!acc[name]) {
        acc[name] = { ...item, count: 0 };
      }
      acc[name].count += 1;
      return acc;
    }, {});

    const groupedArray = Object.values(groupedSidebar);

    setGroupedSide(groupedArray);
  }, [sidebar, data, typeScreen]);

  // Xử lý khi data hoặc sidebar thay đổi
  useEffect(() => {
    processSidebar();
  }, [processSidebar]);

  return (
    <>
      <div className="h-[calc(100vh)] w-full sticky top-4 rounded-r-xl flex-col gap-4 flex bg-gray-100 rounded-lg p-6 max-w-[25rem] z-50 items-center">
        <div className="flex gap-12 flex-col w-full h-full">
          <ModalAddJson modal={modal} setModal={setModal} />
          <div className="gap-12 flex flex-col">
            <Header setModal={setModal} />
            <CheckboxMoveSlice />
            <FrameBoxAndFlex />
          </div>

          <ListDraggle groupedSide={groupedSide} lockScroll={lockScroll} />
          <BackToPage />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
