import { formatDistanceToNowStrict, parseISO } from "date-fns";

/**
 * The function `generateCurrentTimeStamp` in TypeScript generates and returns the current timestamp.
 * @returns The function `generateCurrentTimeStamp` returns the current timestamp in milliseconds.
 */
export const generateCurrentTimeStamp = () => {
  const timestamp = Date.now();
  const last_updated = timestamp;
  return last_updated;
};

/**
 * The `formatDateTimeAgo` function in TypeScript formats a given date string into a human-readable
 * relative time format.
 * @param {string} dateString - The `dateString` parameter is a string representing a date and time in
 * a specific format, such as "2022-01-15T10:30:00". This function `formatDateTimeAgo` takes this date
 * string as input, converts it to a JavaScript `Date` object,
 * @returns The `formatDateTimeAgo` function is returning a formatted string representing the time
 * difference between the input `dateString` and the current time, with the suffix indicating whether
 * the time is in the past or future.
 */
export const formatDateTimeAgo = (dateString: string) => {
  const date = parseISO(dateString);
  return formatDistanceToNowStrict(date, { addSuffix: true });
};
