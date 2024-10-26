export const isEmptyString = (str: any) => {
  if (typeof str !== "string") return true;
  if (str === undefined) return true;
  if (str.trim() === "") return true;
  return false;
};
