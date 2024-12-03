export const transformData = (data, projectId, documentId) => {
  if (!data.childs || data.childs.length === 0) {
    return {
      sliceId: data.id,
      projectId: projectId,
      documentId: documentId,
      thumbnail: data.thumbnail,
      detail: data,
    };
  }

  return data.childs.map(child => {
    return transformData(child, projectId, documentId);
  });
};
