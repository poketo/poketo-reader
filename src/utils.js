// @flow

import ago from 's-ago';
import set from 'clean-set';
import { format, isToday, isYesterday } from 'date-fns';
import groupBy from 'lodash.groupby';

import type { Bookmark, Collection, Chapter } from './types';

const toDate = (n: number): Date => new Date(n * 1000);

const utils = {
  formatTimestamp: (n: number): string => ago(toDate(n)),
  formatAbsoluteTimestamp: (n: number) => {
    const date = toDate(n);

    if (isToday(date)) {
      return 'Today';
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else {
      return format(date, 'MMM D, YYYY');
    }
  },

  getTimestamp: (): number => Math.floor(Date.now() / 1000),

  /**
   * Array Helpers
   */
  groupBy,

  /**
   * Store helpers
   */
  toSeriesId: (chapterId: string) => {
    return chapterId
      .split(':')
      .slice(0, 2)
      .join(':');
  },

  set,

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
  getReaderUrl: (collectionSlug: ?string, chapterId: string) =>
    '/' +
    utils.constructUrl(
      collectionSlug ? `c/${collectionSlug}` : null,
      'read',
      encodeURIComponent(chapterId).replace(/%3A/g, ':'),
    ),
  getCollectionUrl: (collectionSlug: string) => `/c/${collectionSlug}`,

  /**
   * Collection Helpers
   */
  getUnreadMap: (collection: Collection): { [string]: number } => {
    const bookmarks: Bookmark[] = Object.values(collection.bookmarks);

    return bookmarks.reduce((acc, bookmark) => {
      acc[bookmark.id] = bookmark.lastReadAt;
      return acc;
    }, {});
  },

  /**
   * Chapter Helpers
   */
  getChapterLabel: (chapter: Chapter, extended: boolean = false): string => {
    if (chapter.chapterNumber) {
      return `${extended ? 'Chapter ' : ''}${chapter.chapterNumber}`;
    }

    if (chapter.title) {
      return chapter.title;
    }

    if (chapter.volumeNumber) {
      return `Volume ${chapter.volumeNumber}`;
    }

    return 'Unknown';
  },

  getChapterTitle: (chapter: Chapter): ?string => {
    if (!chapter.chapterNumber && chapter.title) {
      return null;
    }

    return chapter.title;
  },

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

  isTouchDevice: () =>
    Boolean('ontouchstart' in window) || window.navigator.msMaxTouchPoints > 0,
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
