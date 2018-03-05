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

  hasNewChapter: (series: Series): boolean =>
    series.updatedAt > series.lastReadAt,
  mostRecentChapter: (arr: Array<Chapter>) =>
    arr.reduce((a, b) => (a.createdAt > b.createdAt ? a : b), {}),
  leastRecentChapter: (arr: Array<Chapter>) =>
    arr.reduce((a, b) => (a.createdAt < b.createdAt ? a : b), {}),

  fetchCollection: collectionId => api.get(`/collection/${collectionId}`),
  fetchMarkAsRead: (collectionId, seriesId) =>
    api.get(`/collection/${collectionId}/markAsRead/${seriesId}`),
  fetchChapter: (collectionId, seriesId, chapterId) =>
    api.get(`/collection/${collectionId}/series/${seriesId}/${chapterId}`),
  addSeries: (collectionId, url) =>
    api.post(`/collection/${collectionId}/add`, { url }),
  removeSeries: (collectionId, seriesId) =>
    api.delete(`/collection/${collectionId}/series/${seriesId}`),
};
