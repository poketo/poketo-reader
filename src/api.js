// @flow

import config from './config';
import axios from 'axios';
import utils from './utils';

export type AxiosResponse = {
  config: Object,
  data: any,
  headers?: Object,
  status: number,
  statusText: string,
  request: XMLHttpRequest,
};

export type AxiosError = {
  response?: AxiosResponse,
  request?: XMLHttpRequest,
  code: string,
  config: Object,
};

const instance = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 8000,
});

const api = {
  fetchCollection: (collectionSlug: string) =>
    instance.get(`/collection/${collectionSlug}`),
  fetchMarkAsRead: (
    collectionSlug: string,
    seriesId: string,
    lastReadAt: number,
  ) =>
    instance.post(`/collection/${collectionSlug}/bookmark/${seriesId}/read`, {
      lastReadAt,
    }),
  fetchAddBookmarkToCollection: (
    collectionSlug: string,
    seriesUrl: string,
    linkToUrl: ?string,
    lastReadAt: ?number,
  ) =>
    instance.post(`/collection/${collectionSlug}/bookmark/new`, {
      seriesUrl,
      linkToUrl,
      lastReadAt,
    }),
  fetchRemoveBookmarkFromCollection: (
    collectionSlug: string,
    seriesId: string,
  ) => instance.delete(`/collection/${collectionSlug}/bookmark/${seriesId}`),
  fetchChapter: (id: string) => {
    const { siteId, seriesSlug, chapterSlug } = utils.getIdComponents(id);

    return instance.get(`/chapter`, {
      params: { siteId, seriesSlug, chapterSlug },
    });
  },
  fetchSeries: (siteId: string, seriesSlug: string) =>
    instance.get(`/series`, { params: { siteId, seriesSlug } }),
  fetchSeriesByUrl: (url: string) =>
    instance.get(`/series`, { params: { url } }),
};

export default api;
