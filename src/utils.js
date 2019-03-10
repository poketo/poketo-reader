// @flow

import set from 'clean-set';
import {
  format,
  distanceInWordsToNow,
  subMonths,
  isToday,
  isYesterday,
} from 'date-fns';
import groupBy from 'lodash.groupby';

import type { ChapterMetadata } from 'poketo';
import type { BookmarkLastReadChapterId } from './types';

const toDate = (n: number): Date => new Date(n * 1000);

const SiteNames = {
  'helvetica-scans': 'Helvetica Scans',
  'hot-chocolate-scans': 'Hot Chocolate Scans',
  'jaiminis-box': `Jaimini’s Box`,
  'kirei-cake': 'Kirei Cake',
  'manga-fox': 'MangaFox',
  'manga-here': 'MangaHere',
  'manga-rock': 'MangaRock',
  'manga-updates': 'Manga Updates',
  mangadex: 'MangaDex',
  mangakakalot: 'Mangakakalot',
  manganelo: 'Manganelo',
  'meraki-scans': 'Meraki Scans',
  'phoenix-serenade': 'Phoenix Serenade',
  'sen-manga': 'Sen Manga',
  'sense-scans': 'Sense Scans',
  'silent-sky-scans': 'Silent Sky Scans',
  'tuki-scans': 'Tuki Scans',
};

const utils = {
  formatTimestamp: (timestamp: number): string => {
    const date = toDate(timestamp);
    const absoluteDateCutOff = subMonths(new Date(), 2);
    const yearsInDateCutOff = subMonths(new Date(), 12);

    if (date < yearsInDateCutOff) {
      return format(date, 'MMM D, YYYY');
    } else if (date < absoluteDateCutOff) {
      return format(date, 'MMM D');
    }

    const distanceString = distanceInWordsToNow(date);
    const formattedDistance = distanceString.replace(/about /i, '') + ' ago';

    return formattedDistance;
  },

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
  toSiteId: (seriesId: string) => {
    return seriesId.split(':').shift();
  },

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
  encodeId: (id: string) => encodeURIComponent(id).replace(/%3A/g, ':'),
  getSeriesUrl: (seriesId: string) => `/series/${utils.encodeId(seriesId)}`,
  getReaderUrl: (chapterId: string) => `/read/${utils.encodeId(chapterId)}`,
  getCollectionUrl: (collectionSlug: string) => `/feed`,
  getRedditUrl: (searchString: string, sortByNew: boolean = true) =>
    `https://www.reddit.com/r/manga/search?q=${encodeURIComponent(
      searchString,
    ).replace(/%20/g, '+')}${sortByNew ? '&sort=new' : ''}&restrict_sr=on`,
  getFeedUrl: (seriesId: string) => `/rss/${seriesId}.json`,

  getUnfollowMessage: (seriesTitle: ?string) =>
    `Do you want to unfollow ${seriesTitle ||
      'this series'}? Your reading progress will be lost.`,

  getSiteNameFromId: (seriesId: string) => {
    const siteId = utils.toSiteId(seriesId);
    return SiteNames[siteId] || 'site';
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

  lastReadChapter: (
    chapters: ChapterMetadata[],
    lastReadId: BookmarkLastReadChapterId = null,
  ): ChapterMetadata => {
    const sortedChapters = utils.sortChapters(chapters);
    const readChapters = utils.getReadChapters(sortedChapters, lastReadId);

    // If there are read chapters, get the last one.
    if (readChapters.length > 0) {
      return readChapters.shift();
    }

    // Otherwise, return the first chapter;
    return sortedChapters.pop();
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
  if (process.env.NODE_ENV !== 'production') {
    if (Boolean(condition) === true) {
      return;
    }

    throw new Error(error);
  }
}
