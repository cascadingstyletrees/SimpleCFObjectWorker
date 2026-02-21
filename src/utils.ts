export const flattenObject = (obj: any, prefix = '') => {
  const result: any = {};
  const traverse = (current: any, p: string) => {
    if (typeof current === 'object' && current !== null && !Array.isArray(current)) {
      Object.keys(current).forEach(key => {
        traverse(current[key], p ? `${p}.${key}` : key);
      });
    } else {
      result[p] = current;
    }
  };
  traverse(obj, prefix);
  return result;
};
