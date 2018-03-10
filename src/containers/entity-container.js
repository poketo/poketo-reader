// @flow

import { Container } from 'unstated';
import utils from '../utils';

import type { Chapter, ChapterPreview, Collection, Series } from '../types';

type State = {
  chapters: { [id: string]: Chapter | ChapterPreview },
  collections: { [id: string]: Collection },
  errorMessage: ?string,
  isError: boolean,
  isFetching: boolean,
  isNotFound: boolean,
  lastFetched: number,
  series: { [id: string]: Series },
};

const getChapterProps = ({ chapters }) => chapters;

export default class CollectionContainer extends Container<State> {
  state = {
    chapters: {},
    collections: {},
    isError: false,
    isFetching: false,
    isNotFound: false,
    lastFetched: 0,
    errorMessage: null,
    series: {},
  };

  /**
   * Fetch a collection from the poketo api, only if it isn't already locally
   * saved first.
   */
  fetchCollectionIfNeeded = (collectionSlug: string) => {
    const existingCollection = this.state.collections[collectionSlug];

    // Don't fetch twice. Most basic caching mechanism.
    if (existingCollection) {
      return;
    }

    this.fetchCollection(collectionSlug);
  };

  /**
   * Fetch a collection from the poketo api.
   */
  fetchCollection = (collectionSlug: string) => {
    this.setState({ isFetching: true });

    utils
      .fetchCollection(collectionSlug)
      .then(response => {
        const unnormalized = response.data;
        const chapters = utils.keyArrayBy(
          // TODO: the api is returning a chapter as `undefined`, not sure why.
          // Filtering it out for now, but we should fix this.
          utils
            .flatten(unnormalized.series.map(getChapterProps))
            .filter(Boolean),
          obj => obj.id,
        );

        const series = utils.keyArrayBy(unnormalized.series, obj => obj.id);
        const bookmarks = utils.keyArrayBy(
          unnormalized.collection.bookmarks,
          obj => obj.id,
        );

        const collections = {
          ...this.state.collections,
          [collectionSlug]: {
            slug: collectionSlug,
            bookmarks,
          },
        };

        this.setState({
          collections,
          series,
          chapters,
          isFetching: false,
          lastFetched: Date.now(),
        });
      })
      .catch(err => {
        this.setState({
          isFetching: false,
          isNotFound: err.status === 404,
          isError: err.status !== 404,
          errorMessage: err.stack,
        });
      });
  };

  findChapterBySlug = (chapterSlug: string): ?Chapter => {
    return Object.values(this.state.chapters).find(
      (chapter: Chapter) => chapter.slug === chapterSlug,
    );
  };

  /**
   * Fetch chapter from poketo api, only if needed.
   */
  fetchChapterIfNeeded = (
    siteId: string,
    seriesSlug: string,
    chapterSlug: string,
  ): Chapter => {
    const existingChapter = Object.values(this.state.chapters).find(
      (chapter: Chapter) => chapter.slug === seriesSlug,
    );

    // Don't fetch twice. Most basic caching mechanism. We do a check on
    // `chapter.pages` to see if it's a Chapter or just a ChapterPreview.
    if (existingChapter && existingChapter.pages) {
      return;
    }

    this.fetchChapter(siteId, seriesSlug, chapterSlug);
  };

  /**
   * Fetch chapter from poketo api.
   */
  fetchChapter = (
    siteId: string,
    seriesSlug: string,
    chapterSlug: string,
  ): Chapter => {
    this.setState({ isFetching: true });

    utils
      .fetchChapter(siteId, seriesSlug, chapterSlug)
      .then(response => {
        this.setState({
          chapters: {
            ...this.state.chapters,
            [response.data.id]: response.data,
          },
          isFetching: false,
        });
      })
      .catch(err => {
        this.setState({
          isFetching: false,
          errorMessage: err.stack,
        });
      });
  };

  /**
   * Update the "lastReadAt" timestamp for a series in a collection.
   */
  markSeriesAsRead = (collectionSlug: string, seriesSlug: string) => {
    // TODO: this is a weird consequence of the half-way between slugs and IDs. We should
    // just be using IDs here, but we're not sending them back from the server.
    const series: Series = Object.values(this.state.series).find(
      (srs: Series) => srs.slug === seriesSlug,
    );

    const collection = this.state.collections[collectionSlug];
    const collectionBookmarks = collection.bookmarks[series.id];

    this.setState({
      collections: {
        ...this.state.collections,
        [collectionSlug]: {
          ...collection,
          series: {
            ...collection.bookmarks,
            [series.id]: {
              ...collectionBookmarks,
              lastReadAt: Math.round(Date.now() / 1000),
            },
          },
        },
      },
    });

    // We don't handle the response since we pass this info optimistically.
    utils.fetchMarkAsRead(collectionSlug, seriesSlug).catch(err => {
      this.setState({ errorMessage: err.stack });
    });
  };
}
