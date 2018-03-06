import ago from 's-ago';
import trae from 'trae';

import type { Series, Chapter } from './types';

const api = trae.create({
  baseUrl: process.env.REACT_APP_API_BASE,
});

export default {
  formatTimestamp: n => ago(new Date(n * 1000)),
  getRandomItems: (arr: Array<any>, count: number = 1) =>
    arr
      .slice()
      .sort(() => 0.5 - Math.random())
      .slice(0, count),
  keyArrayBy: (arr: Array<Object>, getKey: (obj: Object) => string) =>
    arr.reduce((a, b) => ({ ...a, [getKey(b)]: b }), {}),

  hasNewChapter: (series: Series): boolean =>
    series.updatedAt > series.lastReadAt,
  mostRecentChapter: (chapters: Array<Chapter>) =>
    chapters.reduce((a, b) => (a.createdAt > b.createdAt ? a : b), {}),
  leastRecentChapter: (chapters: Array<Chapter>) =>
    chapters.reduce((a, b) => (a.createdAt < b.createdAt ? a : b), {}),

  fetchCollection: collectionSlug => api.get(`/collection/${collectionSlug}`),
  fetchMarkAsRead: (collectionSlug, seriesId) =>
    api.get(`/collection/${collectionSlug}/markAsRead/${seriesId}`),
  fetchChapter: (collectionSlug, seriesId, chapterId) =>
    api.get(`/collection/${collectionSlug}/series/${seriesId}/${chapterId}`),
  addSeries: (collectionSlug, url) =>
    api.post(`/collection/${collectionSlug}/add`, { url }),
  removeSeries: (collectionSlug, seriesId) =>
    api.delete(`/collection/${collectionSlug}/series/${seriesId}`),
};
