export const truncate = (text: string, count: number = 4) => {
  if (!text || text.length < count) return text;
  return `${text.slice(0, count)}...${text.slice(text.length - 4)}`;
};
