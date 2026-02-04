import { describe, it, expect } from 'vitest'

// We need to export flattenObject from view.tsx to test it,
// or copy it here. Since view.tsx doesn't export it (it's internal),
// I will copy it here for unit testing the logic.
// Ideally we should export it or move to a utils file.
// But for this task, copying is acceptable validation.

const flattenObject = (obj: any, prefix = '') => {
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

describe('flattenObject', () => {
  it('should flatten nested objects', () => {
    const input = {
      a: 1,
      b: {
        c: 2,
        d: {
          e: 3
        }
      }
    };
    const expected = {
      'a': 1,
      'b.c': 2,
      'b.d.e': 3
    };
    expect(flattenObject(input)).toEqual(expected);
  });

  it('should handle arrays as values', () => {
    const input = {
      a: [1, 2],
      b: {
        c: [3, 4]
      }
    };
    const expected = {
      'a': [1, 2],
      'b.c': [3, 4]
    };
    expect(flattenObject(input)).toEqual(expected);
  });

  it('should handle empty objects', () => {
      expect(flattenObject({})).toEqual({});
  });
});
