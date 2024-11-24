/**
 * Utility function to handle image upload and conversion to Base64.
 * @param file - The image file to be processed.
 * @returns A Promise that resolves to an object containing the file name and Base64 string.
 */
export const processImageFile = (
  file: File
): Promise<{name: string; base64: string}> => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error("No file provided"));
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (reader.result) {
        resolve({
          name: file.name,
          base64: reader.result.toString(),
        });
      } else {
        reject(new Error("Failed to convert file to Base64"));
      }
    };

    reader.onerror = () => reject(new Error("Error reading the file"));

    reader.readAsDataURL(file);
  });
};
