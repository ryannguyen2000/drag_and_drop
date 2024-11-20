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
