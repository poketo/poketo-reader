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

  /**
   * Store helpers
   */
  getId: (siteId: string, seriesSlug: string, chapterSlug: ?string) =>
    [siteId, seriesSlug, chapterSlug].filter(Boolean).join(':'),
  getIdComponents: (
    id: string,
  ): { siteId: string, seriesSlug: string, chapterSlug: ?string } => {
    const parts = id.split(':');
    const components: any = {
      siteId: parts[0],
      seriesSlug: parts[1],
    };

    if (parts[2]) {
      components.chapterSlug = parts[2];
    }

    return components;
  },

  /**
   * URL Helpers
   */
  getDomainName: (url: string): string => {
    const u = new URL(url);
    return u.hostname.replace(/^www\./i, '');
  },
  normalizeUrl: (url: string): string => {
    return /^https?:\/\//.test(url) ? url : `http://${url}`;
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
  getReadChapters: (
    chapters: Array<Chapter>,
    seriesLastReadAt: number,
  ): Array<Chapter> =>
    chapters.filter(chapter => chapter.createdAt <= seriesLastReadAt),
  mostRecentChapter: (chapters: Array<Chapter>): Chapter =>
    chapters.reduce((a, b) => (a.createdAt > b.createdAt ? a : b), {}),
  leastRecentChapter: (chapters: Array<Chapter>): Chapter =>
    chapters.reduce((a, b) => (a.createdAt < b.createdAt ? a : b), {}),

  isStandalone: () => {
    const isStandaloneSafari = window.navigator.standalone === true;
    const isStandaloneChrome = window.matchMedia('(display-mode: standalone)')
      .matches;
    return isStandaloneSafari || isStandaloneChrome;
  },

  isAppleDevice: () =>
    /iPad|iPhone|iPod/i.test(navigator.userAgent) && !window.MSStream,

  getDeviceOrientation: () =>
    Math.abs(window.orientation) === 90 ? 'landscape' : 'portrait',
};

export default utils;

export function invariant(condition: boolean, error: string | Error): void {
  if (Boolean(condition) === true) {
    return;
  }

  throw new Error(error);
}
