export const flattenObject = (obj: any, prefix = '') => {
  const result: any = {};
  const stackObj = [obj];
  const stackPrefix = [prefix];

  while (stackObj.length > 0) {
    const current = stackObj.pop();
    const p = stackPrefix.pop();

    if (typeof current === 'object' && current !== null && !Array.isArray(current)) {
      const keys = Object.keys(current);
      for (let i = keys.length - 1; i >= 0; i--) {
        const key = keys[i];
        stackObj.push(current[key]);
        stackPrefix.push(p ? `${p}.${key}` : key);
      }
    } else {
      result[p!] = current;
    }
  }

  return result;
};
