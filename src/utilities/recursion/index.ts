type Node = {
  id: string;
  [key: string]: any;
};

export const updateNodeById = (
  tree: Node,
  id: string,
  newData: Partial<Omit<Node, "id">>
): void => {
  if (tree.id === id) {
    for (const key in newData) {
      if (key !== "id") {
        tree[key] = newData[key];
      }
    }
    return;
  }

  if (tree.childs && Array.isArray(tree.childs)) {
    for (const child of tree.childs) {
      updateNodeById(child, id, newData);
    }
  }
};

export const findNodeById = (tree: Node, id: string): Node | null => {
  if (tree.id === id) {
    return tree;
  }

  if (tree.childs && Array.isArray(tree.childs)) {
    for (const child of tree.childs) {
      const result = findNodeById(child, id);
      if (result) {
        return result;
      }
    }
  }

  return null;
};
