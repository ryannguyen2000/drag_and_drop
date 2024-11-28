import Dexie, { EntityTable } from "dexie";
import { INDEXED_DB_NAME } from "../utilities/const/common";

interface DatabaseType {
  id: string;
  doc_id: string;
  data: string;
  last_updated: number;
}

const db = new Dexie(INDEXED_DB_NAME) as Dexie & {
  tool_db: EntityTable<
    DatabaseType,
    "id"
  >;
};

// Schema declaration
db.version(1).stores({
  tool_db: "++id, last_updated, doc_id",
});

export type { DatabaseType };
export { db };
