export const capitalizeEachWord = (text: string): string => {
  if (!text) return "";
  return text
    .replace(/_/g, " ")
    .toLowerCase()
    .split(" ")
    .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : ""))
    .join(" ");
};
