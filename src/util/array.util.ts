export const isNotEmpty = (arr: any): boolean => {
  return (
    Array.isArray(arr) &&
    arr.length > 0 &&
    !arr.every((element) => element == null)
  );
};
export const isEmpty = (arr: any): boolean => {
  return !isNotEmpty(arr);
};

export const contains = (arr: Array<any>, ele: any): boolean => {
  if (!Array.isArray(arr)) {
    return false;
  }
  return arr.indexOf(ele) > -1;
};

export const notContains = (arr: Array<any>, ele: any): boolean => {
  return !contains(arr, ele);
};
