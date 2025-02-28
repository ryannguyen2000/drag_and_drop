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

  const isActiveGridOrFlex = detail.type === "grid" || detail.type === "flex";
  const isOverGridOrFlex = type === "grid" || type === "flex";

  const checkIfExists = (nodes) => {
    nodes.forEach((node) => {
      if (node.id === id) isNewObject = false;
      if (node.childs.length > 0) checkIfExists(node.childs);
    });
  };

  let randomString =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);

  const newId =
    isActiveGridOrFlex || !isNewObject
      ? id
      : _.get(detail, "value") + "$" + randomString;

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
          id: isNewObject ? newId : id,
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
        } else if (isNewObject) {
          console.log("isNewObject");

          if (overIndex !== -1) {
            // ✅ **Tạo một node mới**
            const activeNode = {
              ...detail,
              id: newId,
              childs: [],
            };

            // ✅ **Lưu lại dữ liệu của `over` trước khi thay đổi**
            const overBackup = { ...node.childs[overIndex] };

            // ✅ **Chèn active vào vị trí `overIndex`**
            node.childs.splice(overIndex, 1, activeNode, overBackup);
          }
        } else {
          // Nếu không phải là node mới, tiếp tục kiểm tra
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
    console.log("parent_id root");

    newData.childs.push({
      ...detail,
      id: isNewObject ? newId : id,
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
    if (moveSliceParent && isActiveGridOrFlex && isOverGridOrFlex) {
      const result = swapGridFlex([JSON.parse(JSON.stringify(dataLayout))]); // 🔄 Hoán đổi vị trí Grid <-> Flex
      console.log("swapGridFlex");

      newData = result[0];
    } else if (
      (isActiveGridOrFlex && isOverGridOrFlex) ||
      (!moveSliceParent && !isActiveGridOrFlex && isOverGridOrFlex)
    ) {
      console.log("addToGridOrFlex", {
        isNewObject,
        isActiveGridOrFlex,
        newId,
        id,
      });

      addToGridOrFlex([newData]);
    } else if (
      (!isActiveGridOrFlex && !isOverGridOrFlex) ||
      (!moveSliceParent && isActiveGridOrFlex && !isOverGridOrFlex)
    ) {
      console.log("replaceAndShift");

      replaceAndShift([newData]);
    }
  }
  dispatch(setData(newData));
};
