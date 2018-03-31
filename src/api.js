// @flow

import trae from 'trae';

const http = trae.create({
  baseUrl: process.env.REACT_APP_API_BASE,
});

const api = {
  fetchCollection: (collectionSlug: string) =>
    http.get(`/collection/${collectionSlug}`),
  fetchMarkAsRead: (
    collectionSlug: string,
    seriesId: string,
    lastReadAt: number,
  ) =>
    http.post(`/collection/${collectionSlug}/bookmark/${seriesId}/read`, {
      lastReadAt,
    }),
  fetchAddBookmarkToCollection: (
    collectionSlug: string,
    seriesUrl: string,
    linkToUrl: ?string,
    lastReadAt: ?number,
  ) =>
    http.post(`/collection/${collectionSlug}/bookmark/new`, {
      seriesUrl,
      linkToUrl,
      lastReadAt,
    }),
  fetchRemoveBookmarkFromCollection: (
    collectionSlug: string,
    seriesId: string,
  ) => http.delete(`/collection/${collectionSlug}/bookmark/${seriesId}`),
  fetchChapter: (siteId: string, seriesSlug: string, chapterSlug: string) =>
    http.get(`/chapter`, { params: { siteId, seriesSlug, chapterSlug } }),
  fetchSeries: (siteId: string, seriesSlug: string) =>
    http.get(`/series`, { params: { siteId, seriesSlug } }),
  fetchSeriesByUrl: (url: string) => http.get(`/series`, { params: { url } }),
};

export default api;
