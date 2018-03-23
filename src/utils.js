// @flow

import ago from 's-ago';
import trae from 'trae';

import type { Chapter } from './types';

const api = trae.create({
  baseUrl: process.env.REACT_APP_API_BASE,
});

const e = encodeURIComponent;

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
  mostRecentChapter: (chapters: Array<Chapter>): Chapter =>
    chapters.reduce((a, b) => (a.createdAt > b.createdAt ? a : b), {}),
  leastRecentChapter: (chapters: Array<Chapter>): Chapter =>
    chapters.reduce((a, b) => (a.createdAt < b.createdAt ? a : b), {}),

  /**
   * API Helpers
   */
  fetchCollection: (collectionSlug: string) =>
    api.get(`/collection/${collectionSlug}`),
  fetchMarkAsRead: (
    collectionSlug: string,
    seriesId: string,
    lastReadAt: number,
  ) =>
    api.post(`/collection/${collectionSlug}/bookmark/${e(seriesId)}/read`, {
      lastReadAt,
    }),
  fetchAddBookmarkToCollection: (
    collectionSlug: string,
    seriesUrl: string,
    linkToUrl: ?string,
    lastReadAt: ?number,
  ) =>
    api.post(`/collection/${collectionSlug}/bookmark/new`, {
      seriesUrl,
      linkToUrl,
      lastReadAt,
    }),
  fetchRemoveBookmarkFromCollection: (
    collectionSlug: string,
    seriesId: string,
  ) => api.delete(`/collection/${collectionSlug}/bookmark/${e(seriesId)}`),
  fetchChapter: (siteId: string, seriesSlug: string, chapterSlug: string) =>
    api.get(`/chapter/${siteId}/${e(seriesSlug)}/${e(chapterSlug)}`),
  fetchSeries: (siteId: string, seriesSlug: string) =>
    api.get(`/series/${siteId}/${e(seriesSlug)}`),
  fetchSeriesByUrl: (url: string) => api.get(`/series/${e(url)}`),
};

export default utils;
