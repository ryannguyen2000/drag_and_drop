export const formatText = (input: string) => {
  if (!input || input?.trim() === "") return;
  const textBeforeDollar = input.split("$")[0];

  const cleanedText = textBeforeDollar.replace(/[^a-zA-Z0-9\s]/g, " ");

  const formattedText = cleanedText
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  return formattedText;
};

export const splitValueAndUnit = (value: string) => {
  // RegEx để tìm phần số và phần đơn vị
  const match = value.match(/^([0-9.-]+)([a-zA-Z%]*)$/); // Match số (có thể có dấu chấm thập phân hoặc dấu trừ) và đơn vị
  if (match) {
      const number = match[1]; // Phần số
      const unit = match[2];   // Phần đơn vị
      return [number, unit];    // Trả về dưới dạng mảng
  }
  return ["", ""]; // Nếu không tìm thấy, trả về giá trị mặc định
};

export const splitDimensions = (dimension: string) => {
  const values = dimension.split(" ");
  if (values.length === 1) {
      return [values[0], values[0], values[0], values[0]]; // 1 giá trị cho tất cả
  } else if (values.length === 2) {
      return [values[0], values[1], values[0], values[1]]; // 2 giá trị cho top/bottom và left/right
  } else if (values.length === 3) {
      return [values[0], values[1], values[2], values[1]]; // 3 giá trị cho top, left/right, bottom
  }
  return values; // Trả về 4 giá trị nếu có
};

/**
 * The function `serializeFromJsonToString` removes specific keys from a JSON object and returns the
 * cleaned JSON string.
 * @param {any} hotelData - The `serializeFromJsonToString` function takes a `hotelData` parameter,
 * which is expected to be of type `any`. This function serializes the `hotelData` object to a string
 * after cleaning it by removing properties with keys "_" or ">".
 * @returns The `serializeFromJsonToString` function takes `hotelData` as input, cleans the data by
 * removing properties with keys "_" or ">", and then returns the cleaned data as a JSON string.
 */
export function serializeFromJsonToString(hotelData: any) {
  const cleanedData = JSON.parse(
    JSON.stringify(hotelData, (key, value) => {
      if (key === "_" || key === ">") {
        return undefined;
      }
      return value;
    })
  );
  return JSON.stringify(cleanedData);
}

/**
 * The function `deserializeFromStringToJson` takes a serialized string as input and returns the parsed
 * JSON data.
 * @param {string} serializedData - A string containing serialized JSON data that needs to be
 * deserialized into a JavaScript object.
 * @returns The function `deserializeFromStringToJson` returns the parsed JSON data after converting
 * the serialized string input into a JavaScript object.
 */
export function deserializeFromStringToJson(serializedData: string) {
  const parsedData = JSON.parse(serializedData);
  return parsedData;
}