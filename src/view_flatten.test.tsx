import { describe, it, expect } from 'vitest'
import { flattenObject } from './utils'

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
