// @flow

import ago from 's-ago';
import set from 'clean-set';
import { format, isToday, isYesterday } from 'date-fns';
import groupBy from 'lodash.groupby';

import type { ChapterMetadata } from 'poketo';
import type { Bookmark, BookmarkLastReadChapterId, Collection } from './types';

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
  getUnreadMap: (
    collection: Collection,
  ): { [string]: BookmarkLastReadChapterId } => {
    const bookmarks: Bookmark[] = Object.values(collection.bookmarks);

    return bookmarks.reduce((acc, bookmark) => {
      acc[bookmark.id] = bookmark.lastReadChapterId || null;
      return acc;
    }, {});
  },

  /**
   * Chapter Helpers
   */
  getChapterLabel: (
    chapter: ChapterMetadata,
    extended: boolean = false,
  ): string => {
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

  getChapterTitle: (chapter: ChapterMetadata): ?string => {
    if (!chapter.chapterNumber && chapter.title) {
      return null;
    }

    return chapter.title;
  },

  /**
   * Sorts chapters by publication order, most recent first.
   */
  sortChapters: (chapters: ChapterMetadata[]): ChapterMetadata[] => {
    return chapters.slice().sort((a, b) => b.order - a.order);
  },

  getUnreadChapters: (
    chapters: ChapterMetadata[],
    lastReadId: BookmarkLastReadChapterId = null,
  ): ChapterMetadata[] => {
    const orderedChapters = utils.sortChapters(chapters);

    if (lastReadId === null) {
      return orderedChapters;
    }

    const lastReadIndex = orderedChapters.findIndex(c => c.id === lastReadId);
    const unreadChapters = orderedChapters.slice(0, lastReadIndex);

    return unreadChapters;
  },

  getReadChapters: (
    chapters: ChapterMetadata[],
    lastReadId: BookmarkLastReadChapterId = null,
  ): ChapterMetadata[] => {
    if (lastReadId === null) {
      return [];
    }

    const orderedChapters = utils.sortChapters(chapters);
    const lastReadIndex = orderedChapters.findIndex(c => c.id === lastReadId);
    const readChapters = orderedChapters.slice(lastReadIndex);

    return readChapters;
  },

  nextChapterToRead: (
    chapters: ChapterMetadata[],
    lastReadId: BookmarkLastReadChapterId = null,
  ): ChapterMetadata => {
    const sortedChapters = utils.sortChapters(chapters);
    const unreadChapters = utils.getUnreadChapters(sortedChapters, lastReadId);

    // If there are later chapters, get the next one.
    if (unreadChapters.length > 0) {
      return unreadChapters.pop();
    }

    // Otherwise, return the latest chapter;
    return sortedChapters.shift();
  },

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
