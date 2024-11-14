export {sample_data};

const sample_data = {
  id: "root",
  type: "layout",
  columns: "2",
  rows: "2",
  childs: [
    {
      id: "layout1",
      type: "layout",
      columns: "2",
      rows: "2",
      childs: [
        {
          id: "item1",
          type: "content",
          columns: "2",
          rows: "2",
          childs: [],
        },
        {
          id: "item2",
          type: "content",
          columns: "2",
          rows: "2",
          childs: [],
        },
      ],
    },
    {
      id: "item3",
      type: "content",
      columns: "2",
      rows: "2",
      childs: [],
    },
    {
      id: "layout2",
      type: "layout",
      columns: "2",
      rows: "2",
      childs: [
        {
          id: "item4",
          type: "layout",
          columns: "2",
          rows: "2",
          childs: [
            {
              id: "item5",
              type: "content",
              columns: "2",
              rows: "2",
              childs: [],
            },
            {
              id: "item6",
              type: "content",
              columns: "2",
              rows: "2",
              childs: [],
            },
          ],
        },
      ],
    },
  ],
};
