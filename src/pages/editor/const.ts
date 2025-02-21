import _ from "lodash";
import { setData } from "../../store/DndSlice";

export function findObjectById(obj: any, id: string) {
  // Kiểm tra nếu object hiện tại có id bằng với id tìm kiếm
  if (obj.id === id) {
    return obj;
  }

  // Nếu object có children, tiếp tục tìm trong các children
  if (obj.childs && obj.childs.length > 0) {
    for (let child of obj.childs) {
      const result = findObjectById(child, id);
      if (result) {
        return result;
      }
    }
  }
  return null;
}

export const FindToAdd = ({
  id,
  detail,
  parent_id,
  over_id,
  type,
  dataLayout,
  moveSliceParent,
  dispatch,
}) => {
  let newData = JSON.parse(JSON.stringify(dataLayout));
  let layoutChilds = [];
  let activeItemBackup = null; // ✅ Khôi phục biến lưu dữ liệu của `active.id`
  let isNewObject = true;

  const checkIfExists = (nodes) => {
    nodes.forEach((node) => {
      if (node.id === id) isNewObject = false;
      if (node.childs.length > 0) checkIfExists(node.childs);
    });
  };

  checkIfExists([newData]);

  // ✅ Hàm loại bỏ object đang kéo khỏi vị trí cũ (nếu cần)
  const removeChildFromParent = (nodes, parent = null) => {
    nodes.forEach((node) => {
      // ✅ Kiểm tra nếu `over_id` và `activeId` cùng cấp
      let overIndex = _.findIndex(node.childs, { id: over_id });
      let activeIndex = _.findIndex(node.childs, { id: id });

      if (
        parent &&
        overIndex !== -1 &&
        activeIndex !== -1 &&
        type !== "grid" &&
        type !== "flex"
      ) {
        return;
      }
      // ✅ Nếu `activeId` nằm trong `root.childs`, xóa trước
      if (node.id === "root") {
        node.childs = node.childs.filter((child) => {
          if (child.id === id) {
            // console.log("🚨 Removing Object from Root:", child);
            activeItemBackup = JSON.parse(JSON.stringify(child));
            layoutChilds = child.childs;
            return false;
          }
          return true;
        });
      }

      node.childs = node.childs.filter((child) => {
        if (child.id === id) {
          activeItemBackup = JSON.parse(JSON.stringify(child));
          layoutChilds = child.childs;
          return false;
        }
        return true;
      });

      if (node.childs.length > 0) removeChildFromParent(node.childs, node);
    });
  };

  // ✅ Nếu object đã tồn tại trong cây, loại bỏ nó trước khi chèn lại
  if (!isNewObject) {
    removeChildFromParent([newData], null);
  }

  // ✅ Khi thêm vào `grid` hoặc `flex`, giữ lại `dataSlice`
  const addToGridOrFlex = (nodes) => {
    nodes.forEach((node) => {
      if (
        node.id === over_id &&
        (node.type === "grid" || node.type === "flex")
      ) {
        node.childs.push({
          ...(isNewObject ? detail : activeItemBackup),
          id,
          childs: layoutChilds,
          dataSlice: activeItemBackup?.dataSlice || detail.dataSlice, // ✅ Giữ `dataSlice`
        });
      } else if (node.childs.length > 0) {
        addToGridOrFlex(node.childs);
      }
    });
  };

  // ✅ **Hàm hoán đổi vị trí Grid <-> Flex**
  const swapGridFlex = (nodes, parent = null) => {
    const callbackFC = (cbNodes) => {
      cbNodes.forEach((node) => {
        let overIndex = _.findIndex(node.childs, { id: over_id });
        let activeIndex = _.findIndex(node.childs, { id });

        if (overIndex !== -1 && activeIndex !== -1) {
          // ✅ **Lưu lại cả `activeItem` và `overItem`**
          const activeBackup = { ...node.childs[activeIndex] };
          const overBackup = { ...node.childs[overIndex] };

          // ✅ **Hoán đổi vị trí giữa `activeItem` và `overItem`**
          [node.childs[activeIndex], node.childs[overIndex]] = [
            overBackup,
            activeBackup,
          ];
        } else {
          callbackFC(node.childs);
        }
      });
    };
    callbackFC(nodes);
    return nodes;
  };

  const replaceAndShift = (nodes) => {
    nodes.forEach((node, index) => {
      let overIndex = _.findIndex(node.childs, { id: over_id });
      let overItem = _.find(node.childs, { id: over_id });
      let activeIndex = _.findIndex(node.childs, { id: id });
      // ✅ Nếu `activeId` và `over_id` cùng cấp, hoán đổi vị trí
      if (overIndex !== -1 && activeIndex !== -1 && overIndex !== activeIndex) {
        // ✅ Hoán đổi vị trí giữa `activeId` và `over_id`
        [node.childs[activeIndex], node.childs[overIndex]] = [
          node.childs[overIndex],
          node.childs[activeIndex],
        ];
        return; // ✅ Không cần thực hiện thay thế hoặc xóa thêm
      }

      if (
        overIndex !== -1 &&
        overItem &&
        overItem.type !== "grid" &&
        overItem.type !== "flex"
      ) {
        // ✅ Lưu toàn bộ dữ liệu của `overItem`
        const backupOverItem = { ...overItem };

        // ✅ Ensure Dragged Object is Not Lost
        let activeItemData = isNewObject ? detail : activeItemBackup;

        // ✅ Kiểm tra nếu `activeId` đã tồn tại trong `node.childs`, thì không cần xóa `over_id`
        const existingActiveIndex = _.findIndex(node.childs, { id: id });

        if (existingActiveIndex !== -1) {
          console.warn(
            `⚠️ Object ${id} đã tồn tại trong danh sách child, bỏ qua xóa over_id.`
          );
        } else {
          // ✅ Chỉ xóa `over_id` nếu object đang kéo không tồn tại sẵn
          node.childs.splice(overIndex, 1);
        }

        // ✅ Chèn object đang kéo vào đúng vị trí `over_id`
        node.childs.splice(overIndex, 0, {
          ...activeItemData,
          id,
          childs: layoutChilds,
        });

        // ✅ Đẩy `overItem` xuống nếu nó chưa tồn tại
        if (!node.childs.some((child) => child.id === backupOverItem.id)) {
          node.childs.splice(overIndex + 1, 0, backupOverItem);
        }
      } else {
        replaceAndShift(node.childs);
      }
    });
  };

  // 🛠 Nếu kéo vào `grid` tổng lớn nhất (`root`), thêm vào `childs` của `root`
  if (parent_id === "root") {
    newData.childs.push({
      id,
      columns: detail.columns,
      rows: detail.rows,
      colspan: detail.colspan,
      rowspan: detail.rowspan,
      gap: detail.gap,
      justifyContent: detail.justifyContent,
      alignItems: detail.alignItems,
      type: detail.type,
      childs: layoutChilds,
      thumbnail: detail.thumbnail,
      dataSlice: activeItemBackup?.dataSlice || detail.dataSlice, // ✅ Giữ `dataSlice`
    });
  } else {
    const isActiveGridOrFlex = detail.type === "grid" || detail.type === "flex";
    const isOverGridOrFlex = type === "grid" || type === "flex";
    if (moveSliceParent && isActiveGridOrFlex && isOverGridOrFlex) {
      const result = swapGridFlex([JSON.parse(JSON.stringify(dataLayout))]); // 🔄 Hoán đổi vị trí Grid <-> Flex
      newData = result[0];
    } else if (
      (isActiveGridOrFlex && isOverGridOrFlex) ||
      (!moveSliceParent && !isActiveGridOrFlex && isOverGridOrFlex)
    ) {
      addToGridOrFlex([newData]);
    } else if (
      (!isActiveGridOrFlex && !isOverGridOrFlex) ||
      (!moveSliceParent && isActiveGridOrFlex && !isOverGridOrFlex)
    ) {
      replaceAndShift([newData]);
    }
  }
  dispatch(setData(newData));
};

const xx = {
  id: "root",
  thumnail: "_",
  type: "grid",
  columns: "1",
  gap: "1",
  rows: "1",
  colspan: "1",
  rowspan: "1",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  childs: [
    {
      id: "Box-f5988b19-1931-4498-87c2-4ac646a8a650",
      columns: "1",
      rows: "1",
      colspan: "1",
      rowspan: "1",
      gap: "3",
      justifyContent: "flex-start",
      alignItems: "flex-start",
      type: "flex",
      childs: [
        {
          colspan: "1",
          rowspan: "1",
          columns: "1",
          rows: "1",
          type: "flex",
          gap: "1",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          thumbnail: "_",
          id: "Box-74270b67-65d4-4b87-86df-d91d0cd562f2",
          childs: [
            {
              id: "test_box1$28ed46e0-08db-46b3-826a-f7b7f6f67c82",
              columns: "1",
              rows: "1",
              colspan: "1",
              rowspan: "1",
              gap: "1",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              type: "content",
              childs: [],
              thumbnail: "_",
            },
          ],
        },
        {
          colspan: "1",
          rowspan: "1",
          columns: "1",
          rows: "1",
          type: "flex",
          gap: "1",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          thumbnail: "_",
          id: "Box-e383ed6c-25cf-4295-8abe-371776e7d264",
          childs: [
            {
              id: "title_complex$507d56c3-55e4-4786-87d9-999ab0552f6b",
              columns: "1",
              rows: "1",
              colspan: "1",
              rowspan: "1",
              gap: "1",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              type: "content",
              childs: [],
              thumbnail: "_",
            },
            {
              colspan: "1",
              rowspan: "1",
              columns: "1",
              rows: "1",
              type: "content",
              gap: "1",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              thumbnail: "_",
              id: "text$5315ae68-3332-49e7-a932-6962544a8713",
              childs: [],
              dataSlice: {
                title: "3",
              },
            },
            {
              colspan: "1",
              rowspan: "1",
              columns: "1",
              rows: "1",
              type: "content",
              gap: "1",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              thumbnail: "_",
              id: "link$188bf6c9-5e15-48f3-9a68-344505d46748",
              childs: [],
              dataSlice: {
                title: "4",
              },
            },
            {
              id: "vertical_steps$f518f389-2935-48df-8c4a-60928f41ba4b",
              columns: "1",
              rows: "1",
              colspan: "1",
              rowspan: "1",
              gap: "1",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              type: "content",
              childs: [],
              thumbnail: "_",
            },
          ],
        },
      ],
      thumbnail: "_",
    },
    {
      id: "Box-c96a2ffd-9ddd-4c62-94d5-f2593230d129",
      columns: "1",
      rows: "1",
      colspan: "1",
      rowspan: "1",
      gap: "1",
      justifyContent: "flex-start",
      alignItems: "flex-start",
      type: "flex",
      childs: [],
      thumbnail: "_",
    },
    {
      id: "Box-908569a0-0580-435a-a9df-53c45c872ac7",
      columns: "1",
      rows: "1",
      colspan: "1",
      rowspan: "1",
      gap: "1",
      justifyContent: "flex-start",
      alignItems: "flex-start",
      type: "flex",
      childs: [
        {
          id: "Box-ff05349a-f7d7-46b1-b94a-1859f1d77e43",
          columns: "1",
          rows: "1",
          colspan: "1",
          rowspan: "1",
          gap: "1",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          type: "flex",
          childs: [
            {
              id: "text$9eea41dc-d595-4d05-b0ea-57f25b717d41",
              columns: "1",
              rows: "1",
              colspan: "1",
              rowspan: "1",
              gap: "1",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              type: "content",
              childs: [],
              thumbnail: "_",
            },
          ],
          thumbnail: "_",
        },
      ],
      thumbnail: "_",
      dataSlice: {
        titles: {},
      },
    },
    {
      id: "Box-a53a0670-71ea-4506-81c9-27cded549e88",
      columns: "1",
      rows: "1",
      colspan: "1",
      rowspan: "1",
      gap: "1",
      justifyContent: "flex-start",
      alignItems: "flex-start",
      type: "flex",
      childs: [
        {
          colspan: "1",
          rowspan: "1",
          columns: "1",
          rows: "1",
          type: "flex",
          gap: "1",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          thumbnail: "_",
          id: "Box-e558b3fa-bc77-4903-9a35-e232b169aeb2",
          childs: [
            {
              id: "text$28c64bb2-10d6-4ef8-89ee-b00751d72039",
              columns: "1",
              rows: "1",
              colspan: "1",
              rowspan: "1",
              gap: "1",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              type: "content",
              childs: [],
              thumbnail: "_",
            },
          ],
        },
      ],
      thumbnail: "_",
    },
  ],
};
