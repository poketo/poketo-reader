// @flow

import ago from 's-ago';
import trae from 'trae';

import type { Chapter } from './types';

const api = trae.create({
  baseUrl: process.env.REACT_APP_API_BASE,
});

const e = encodeURIComponent;

export default {
  formatTimestamp: (n: number) => ago(new Date(n * 1000)),
  getRandomItems: (arr: Array<any>, count: number = 1) =>
    arr
      .slice()
      .sort(() => 0.5 - Math.random())
      .slice(0, count),
  keyArrayBy: (arr: Array<Object>, getKey: (obj: Object) => string) =>
    arr.reduce((a, b) => ({ ...a, [getKey(b)]: b }), {}),

  flatten: (arr: Array<any>) => [].concat(...arr),

  mostRecentChapter: (chapters: Array<Chapter>): Chapter =>
    chapters.reduce((a, b) => (a.createdAt > b.createdAt ? a : b), {}),
  leastRecentChapter: (chapters: Array<Chapter>): Chapter =>
    chapters.reduce((a, b) => (a.createdAt < b.createdAt ? a : b), {}),

  fetchCollection: (collectionSlug: string) =>
    api.get(`/collection/${collectionSlug}`),
  fetchMarkAsRead: (collectionSlug: string, seriesSlug: string) =>
    api.get(`/collection/${collectionSlug}/markAsRead/${e(seriesSlug)}`),
  fetchChapter: (siteId: string, seriesSlug: string, chapterSlug: string) =>
    api.get(`/chapter/${siteId}/${e(seriesSlug)}/${e(chapterSlug)}`),
};
