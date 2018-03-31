// @flow

import ago from 's-ago';

import type { Chapter } from './types';

const utils = {
  formatTimestamp: (n: number) => ago(new Date(n * 1000)),
  getTimestamp: (): number => Math.floor(Date.now() / 1000),

  /**
   * Array Helpers
   */
  getRandomItems: (arr: Array<any>, count: number = 1) =>
    arr
      .slice()
      .sort(() => 0.5 - Math.random())
      .slice(0, count),
  flatten: (arr: Array<any>) => [].concat(...arr),
  keyArrayBy: (arr: Array<Object>, getKey: (obj: Object) => string) =>
    arr.reduce((a, b) => ({ ...a, [getKey(b)]: b }), {}),

  /**
   * URL Helpers
   */
  getDomainName: (url: string): string => {
    const u = new URL(url);
    return u.hostname.replace(/^www\./i, '');
  },
  constructUrl: (...args: Array<?string>) => args.filter(Boolean).join('/'),
  isUrl: (url: ?string): boolean => {
    if (url === null || url === undefined) {
      return false;
    }
    return /^https?:\/\/[^ "]+$/.test(url);
  },
  getReaderUrl: (
    collectionSlug: ?string,
    siteId: string,
    seriesSlug: string,
    chapterSlug: ?string,
  ) =>
    '/' +
    utils.constructUrl(
      collectionSlug ? `c/${collectionSlug}` : null,
      'read',
      siteId,
      seriesSlug,
      chapterSlug,
    ),
  getCollectionUrl: (collectionSlug: string) => `/c/${collectionSlug}`,

  /**
   * Chapter Helpers
   */
  getUnreadChapters: (
    chapters: Array<Chapter>,
    seriesLastReadAt: number,
  ): Array<Chapter> =>
    chapters.filter(chapter => chapter.createdAt > seriesLastReadAt),
  mostRecentChapter: (chapters: Array<Chapter>): Chapter =>
    chapters.reduce((a, b) => (a.createdAt > b.createdAt ? a : b), {}),
  leastRecentChapter: (chapters: Array<Chapter>): Chapter =>
    chapters.reduce((a, b) => (a.createdAt < b.createdAt ? a : b), {}),
};

export default utils;
