export {GridCol, GridRow, SpanCol, SpanRow} from "./grid";

export {findNodeById, addNewChild, moveChild, getUniqueContentItems};

function findNodeById(node, id) {
  if (node.id === id) return node;
  if (node.childs && node.childs.length > 0) {
    for (const child of node.childs) {
      const result = findNodeById(child, id);
      if (result) return result;
    }
  }
  return null;
}

function addNewChild(root, parentId, newChild) {
  const parent = findNodeById(root, parentId);
  if (parent) {
    if (!parent.childs) parent.childs = [];
    parent.childs.push(newChild);
    return true;
  }
  return false;
}

function moveChild(root, childId, newParentId) {
  let childNode = null;
  let oldParent = null;

  function removeChild(node) {
    if (node.childs) {
      for (let i = 0; i < node.childs.length; i++) {
        if (node.childs[i].id === childId) {
          childNode = node.childs[i];
          node.childs.splice(i, 1);
          oldParent = node;
          return true;
        }
        if (removeChild(node.childs[i])) return true;
      }
    }
    return false;
  }

  if (!removeChild(root)) return false;

  const newParent = findNodeById(root, newParentId);
  if (newParent && childNode) {
    if (!newParent.childs) newParent.childs = [];
    newParent.childs.push(childNode);
    return true;
  }

  if (oldParent && childNode) oldParent.childs.push(childNode);
  return false;
}

function getUniqueContentItems(data) {
  const uniqueItems = [];
  const seenIds = new Set();

  function traverse(node) {
    if (node.type === "content" && !seenIds.has(node.id)) {
      uniqueItems.push(node);
      seenIds.add(node.id);
    }

    if (node.childs && node.childs.length > 0) {
      node.childs.forEach((child) => traverse(child));
    }
  }

  traverse(data);
  return uniqueItems;
}
