// @flow

import config from './config';
import axios from 'axios';
import type { BookmarkLastReadChapterId } from './types';

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

const SCRAPING_TIMEOUT = 8000;

const instance = axios.create({
  baseURL: config.apiBaseUrl,
});

const api = {
  fetchCollection: (collectionSlug: string) =>
    instance.get(`/collection/${collectionSlug}`),
  fetchMarkAsRead: (
    collectionSlug: string,
    seriesId: string,
    options: {
      lastReadChapterId: BookmarkLastReadChapterId,
      lastReadAt: number,
    },
  ) =>
    instance.post(`/collection/${collectionSlug}/bookmark/${seriesId}/read`, {
      lastReadChapterId: options.lastReadChapterId,
      lastReadAt: options.lastReadAt,
    }),
  fetchAddBookmarkToCollection: (
    collectionSlug: string,
    seriesUrl: string,
    linkToUrl: ?string,
    lastReadChapterId: BookmarkLastReadChapterId = null,
  ) =>
    instance.post(`/collection/${collectionSlug}/bookmark/new`, {
      seriesUrl,
      linkToUrl,
      lastReadChapterId,
    }),
  fetchRemoveBookmarkFromCollection: (
    collectionSlug: string,
    seriesId: string,
  ) => instance.delete(`/collection/${collectionSlug}/bookmark/${seriesId}`),
  fetchChapter: (id: string) =>
    instance.get(`/chapter`, {
      params: { id },
      timeout: SCRAPING_TIMEOUT,
    }),
  fetchSeries: (id: string) =>
    instance.get(`/series`, {
      params: { id },
      timeout: SCRAPING_TIMEOUT,
    }),
  fetchSeriesByUrl: (url: string) =>
    instance.get(`/series`, { params: { url }, timeout: SCRAPING_TIMEOUT }),
};

export default api;
