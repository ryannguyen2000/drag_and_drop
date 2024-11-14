interface Block {
  id: string;
  type: "layout" | "content";
  columns: number;
  rows: number;
  colSpan: number;
  rowSpan: number;
  childrens?: Block[];
}
