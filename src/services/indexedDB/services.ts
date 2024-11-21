import { db } from "../../config/db";
import { generateCurrentTimeStamp } from "../../utilities/dateTime";

/**
 * The function `getCachedDataFromIndexedDB` retrieves cached data from IndexedDB if it exists and is
 * not older than one day.
 * @param {number} id - The `id` parameter is the unique identifier used to retrieve cached data from
 * IndexedDB.
 * @returns If the data exists in the IndexedDB and is not older than one day, the function will return
 * the cached data object. Otherwise, it will return `null`.
 */
export async function getCachedDataFromIndexedDB(id: number) {
  const dexieData = await db.tool_db.where("id").equals(id).toArray();

  // Verify if data exists and is not older than one day
  if (dexieData.length > 0) {
    const dataAge = Date.now() - dexieData[0].last_updated;
    const oneDayInMillis = 24 * 60 * 60 * 1000;

    if (dataAge < oneDayInMillis) {
      return dexieData[0]; // Return cached data if within 1 day
    }

    return null;
  }
  return null;
}

/**
 * The function `cacheDataToIndexedDB` stores data in IndexedDB with a timestamp and updates existing
 * data if the document ID matches.
 * @param {string} data - The `data` parameter in the `cacheDataToIndexedDB` function is a string that
 * represents the data you want to cache in the IndexedDB. This could be any kind of data that you want
 * to store and retrieve later, such as JSON data, text, or binary data.
 * @param {string} doc_id - The `doc_id` parameter is a unique identifier for the document or data that
 * you want to cache in IndexedDB. It is used to distinguish different pieces of data stored in the
 * database.
 */
export async function cacheDataToIndexedDB(data: string, doc_id: string) {
  const timestamp = generateCurrentTimeStamp();

  await db.tool_db.put({
    id: doc_id,
    doc_id,
    data,
    last_updated: timestamp,
  });
}
