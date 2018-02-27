import ago from 's-ago';
import trae from 'trae';

const api = trae.create({
  baseUrl: process.env.REACT_APP_API_BASE,
});

export default {
  formatTimestamp: n => ago(new Date(n * 1000)),
  hasNewChapter: series => series.updatedAt > series.lastReadAt,

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
