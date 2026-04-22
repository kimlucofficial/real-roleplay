export const countWords = (text) =>
  text.trim().split(/\s+/).filter(Boolean).length;

export const validateDefault = (text) => {
  const words = countWords(text);
  if (words < 50) return "Tối thiểu 50 Từ";
  if (words > 300) return "Tối đa 300 Ký tự";
  return "";
};

export const validateReason = (text) => {
  const words = countWords(text);
  if (words < 30) return "Tối thiểu 30 Từ";
  if (words > 200) return "Tối đa 200 Ký tự";
  return "";
};
