// @flow

import { URL } from 'url';
import normalizeUrl from 'normalize-url';

export default {
  isUrl: (input: string) => {
    try {
      // eslint-disable-next-line no-new
      new URL(normalizeUrl(input));
    } catch (err) {
      return false;
    }

    return true;
  },

  isPoketoId: (input: string) => {
    const components = input.split(':');
    const isValidId = components.length > 1 && components.length < 4;
    return isValidId;
  },

  timestamp: () => Math.round(Date.now() / 1000),

  /*
   * Returns an Object keyed by the given function.
   */
  keyArrayBy: (arr: Object[], getKey: (obj: Object) => string) =>
    arr.reduce((a, b) => ({ ...a, [getKey(b)]: b }), {}),

  /*
   * Returns a new Array with the given index replaced with the new item.
   */
  replaceItemAtIndex: (
    arr: Array<mixed>,
    index: number,
    item: mixed,
  ): Array<mixed> => [...arr.slice(0, index), item, ...arr.slice(index + 1)],

  /*
   * Returns a new Array with the given index removed.
   */
  deleteItemAtIndex: (arr: Array<mixed>, index: number): Array<mixed> => [
    ...arr.slice(0, index),
    ...arr.slice(index + 1),
  ],
};
