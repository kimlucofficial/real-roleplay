export const countWords = (text) =>
  text.trim().split(/\s+/).filter(Boolean).length;

export const validateDefault = (text) => {
  const words = countWords(text);
  if (words < 50) return "Tối thiểu 50 chữ";
  if (words > 300) return "Tối đa 300 chữ";
  return "";
};

export const validateReason = (text) => {
  const words = countWords(text);
  if (words < 30) return "Tối thiểu 30 chữ";
  if (words > 300) return "Tối đa 300 chữ";
  return "";
};
