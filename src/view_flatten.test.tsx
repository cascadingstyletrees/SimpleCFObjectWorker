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

  it('should flatten deeply nested objects without overflowing the call stack', () => {
    let input: any = 'leaf';
    for (let i = 0; i < 20000; i++) {
      input = { child: input };
    }

    const result = flattenObject(input);
    expect(Object.keys(result)).toEqual([Array(20000).fill('child').join('.')]);
    expect(Object.values(result)).toEqual(['leaf']);
  });

  it('should preserve prefixes and depth-first property order', () => {
    const result = flattenObject({ a: { b: 1, c: 2 }, d: null, e: [3] }, 'root');
    expect(Object.entries(result)).toEqual([
      ['root.a.b', 1],
      ['root.a.c', 2],
      ['root.d', null],
      ['root.e', [3]],
    ]);
  });
});
