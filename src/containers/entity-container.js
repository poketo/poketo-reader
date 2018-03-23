// @flow

import { Container } from 'unstated';
import utils from '../utils';

import type { Chapter, ChapterPreview, Collection, Series } from '../types';

type FetchStatusState = {
  isFetching: boolean,
  errorMessage: ?string,
};

type State = {
  chapters: { [id: string]: Chapter | ChapterPreview },
  chaptersStatus: FetchStatusState,
  collections: { [id: string]: Collection },
  collectionsStatus: FetchStatusState,
  series: { [id: string]: Series },
  seriesStatus: FetchStatusState,
};

const getChapterProps: ChapterPreview = ({ chapters }) => chapters;

export default class EntityContainer extends Container<State> {
  state = {
    chapters: {},
    chaptersStatus: {
      isFetching: false,
      errorMessage: null,
    },
    collections: {},
    collectionsStatus: {
      isFetching: false,
      isAddingBookmark: false,
      errorMessage: null,
    },
    series: {},
    seriesStatus: {
      isFetching: false,
      errorMessage: null,
    },
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
    this.setState({
      collectionsStatus: {
        isFetching: true,
        errorMessage: null,
      },
    });

    utils
      .fetchCollection(collectionSlug)
      .then(response => {
        const unnormalized = response.data;
        // TODO: the api is returning a chapter as `undefined`, not sure why.
        // Filtering it out for now, but we should fix this.
        const chapterData = utils
          .flatten(unnormalized.series.map(getChapterProps))
          .filter(Boolean);

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

        const series = { ...this.state.series };
        unnormalized.series.forEach(s => {
          series[s.id] = {
            ...this.state.series[s.id],
            ...s,
          };
        });

        const chapters = { ...this.state.chapters };
        chapterData.forEach(chapter => {
          chapters[chapter.id] = {
            ...this.state.chapters[chapter.id],
            ...chapter,
          };
        });

        this.setState({
          collections,
          collectionsStatus: {
            isFetching: false,
            errorMessage: null,
          },
          series,
          chapters,
        });
      })
      .catch(err => {
        this.setState({
          collectionsStatus: {
            isFetching: false,
            errorMessage: err.stack,
          },
        });
      });
  };

  /**
   * Add a series to a collection.
   */
  addBookmarkToCollection = (
    collectionSlug: string,
    collectionData: Collection,
    seriesData: Series,
  ) => {
    const collections = {
      ...this.state.collections,
      [collectionData.slug]: {
        ...this.state.collections[collectionData.slug],
        ...collectionData,
      },
    };

    const series = {
      ...this.state.series,
      [seriesData.id]: {
        ...this.state.series[seriesData.id],
        ...seriesData,
      },
    };

    this.setState({ collections, series });
  };

  /**
   * Delete a bookmark from a collection.
   */
  removeBookmarkFromCollection = (collectionSlug: string, seriesId: string) => {
    const collections = { ...this.state.collections };
    delete collections[collectionSlug].bookmarks[seriesId];
    this.setState({ collections });

    utils
      .fetchRemoveBookmarkFromCollection(collectionSlug, seriesId)
      .catch(err => {
        // swallow errors
      });
  };

  /**
   * Update the "lastReadAt" timestamp for a bookmark in a collection.
   */
  markSeriesAsRead = (
    collectionSlug: string,
    seriesId: string,
    lastReadAt: number,
  ) => {
    const collection = this.state.collections[collectionSlug];
    const bookmark = collection.bookmarks[seriesId];

    this.setState({
      collections: {
        ...this.state.collections,
        [collectionSlug]: {
          ...collection,
          bookmarks: {
            ...collection.bookmarks,
            [seriesId]: {
              ...bookmark,
              lastReadAt,
            },
          },
        },
      },
    });

    // We don't handle the response since we pass this info optimistically.
    utils.fetchMarkAsRead(collectionSlug, seriesId, lastReadAt).catch(err => {
      // swallow errors
    });
  };

  findCollectionBySlug = (collectionSlug: string): ?Collection => {
    return this.state.collections[collectionSlug] || null;
  };

  findChapterBySlug = (chapterSlug: string): ?Chapter => {
    return Object.values(this.state.chapters).find(
      (chapter: Chapter) => chapter.slug === chapterSlug,
    );
  };

  findSeriesBySlug = (seriesSlug: string): ?Series => {
    return Object.values(this.state.series).find(
      (series: Series) => series.slug === seriesSlug,
    );
  };

  fetchSeriesIfNeeded = (siteId: string, seriesSlug: string) => {
    const existingSeries = Object.values(this.state.series).find(
      (series: Chapter) => series.slug === seriesSlug,
    );

    // Don't fetch twice. Most basic caching mechanism.
    if (existingSeries) {
      return;
    }

    this.fetchSeries(siteId, seriesSlug);
  };

  fetchSeries = (siteId: string, seriesSlug: string) => {
    this.setState({
      seriesStatus: {
        isFetching: true,
        errorMessage: null,
      },
    });

    utils
      .fetchSeries(siteId, seriesSlug)
      .then(response => {
        this.setState({
          series: {
            ...this.state.series,
            [response.data.id]: response.data,
          },
          seriesStatus: {
            isFetching: false,
            errorMessage: null,
          },
        });
      })
      .catch(err => {
        this.setState({
          seriesStatus: {
            isFetching: false,
            errorMessage: err.stack,
          },
        });
      });
  };

  fetchSeriesByUrl = (url: string) => {
    this.setState({
      seriesStatus: {
        isFetching: true,
        errorMessage: null,
      },
    });

    utils
      .fetchSeriesByUrl(url)
      .then(response => {
        this.setState({
          series: {
            ...this.state.series,
            [response.data.id]: response.data,
          },
          seriesStatus: {
            isFetching: false,
            errorMessage: null,
          },
        });
      })
      .catch(err => {
        this.setState({
          seriesStatus: {
            isFetching: false,
            errorMessage: err.stack,
          },
        });
      });
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
      (chapter: Chapter) => chapter.slug === chapterSlug,
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
    this.setState({
      chaptersStatus: {
        isFetching: true,
        errorMessage: null,
      },
    });

    utils
      .fetchChapter(siteId, seriesSlug, chapterSlug)
      .then(response => {
        this.setState({
          chapters: {
            ...this.state.chapters,
            [response.data.id]: response.data,
          },
          chaptersStatus: {
            isFetching: false,
            errorMessage: null,
          },
        });
      })
      .catch(err => {
        this.setState({
          chaptersStatus: {
            isFetching: false,
            errorMessage: err.stack,
          },
        });
      });
  };
}
