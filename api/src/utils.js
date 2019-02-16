// @flow

import { URL } from 'url';
import isUrl from 'is-url-superb';
import normalizeUrl from 'normalize-url';

export function invariant() {
  // No-op
}

export default {
  isUrl: (input: string) => {
    return isUrl(input);
  },

  isPoketoId: (input: string) => {
    const components = input.split(':');
    const isValidId = components.length > 1 && components.length < 4;
    return isValidId;
  },

  timestamp: () => Math.round(Date.now() / 1000),
  dateToTimestamp: (date: Date): number => Math.round(date.valueOf() / 1000),
  timestampToDate: (timestamp: number) => new Date(timestamp * 1000),

  /*
   * Returns an Object keyed by the given function.
   */
  keyArrayBy: (arr: Array<Object>, getKey: (obj: Object) => string) =>
    arr.reduce((a, b) => ({ ...a, [getKey(b)]: b }), {}),

  /*
   * Returns a new Array with the given index replaced with the new item.
   */
  replaceItemAtIndex: (arr: Array<mixed>, index: number, item: mixed) => [
    ...arr.slice(0, index),
    item,
    ...arr.slice(index + 1),
  ],

  /*
   * Returns a new Array with the given index removed.
   */
  deleteItemAtIndex: (arr: Array<mixed>, index: number) => [
    ...arr.slice(0, index),
    ...arr.slice(index + 1),
  ],
};
