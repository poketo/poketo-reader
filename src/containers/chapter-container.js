// @flow

import { Container } from 'unstated';

import utils from '../utils';

import type { Chapter, ChapterPreview } from '../types';

type State = {
  chapters: { [id: string]: Chapter | ChapterPreview },
  errorMessage: ?string,
  isFetching: boolean,
};

export default class ChapterContainer extends Container<State> {
  state = {
    chapters: {},
    errorMessage: null,
    isFetching: false,
  };

  fetchChapterIfNeeded = (
    collectionSlug: string,
    seriesSlug: string,
    chapterSlug: string,
  ): Chapter => {
    // Don't fetch twice. Most basic caching mechanism.
    const existingChapter = Object.values(this.state.chapters).find(
      (chapter: Chapter) => chapter.slug === chapterSlug,
    );

    if (existingChapter) {
      return;
    }

    this.fetchChapter(collectionSlug, seriesSlug, chapterSlug);
  };

  fetchChapter = (
    collectionSlug: string,
    seriesSlug: string,
    chapterSlug: string,
  ): Chapter => {
    this.setState({ isFetching: true });

    utils
      .fetchChapter(collectionSlug, seriesSlug, chapterSlug)
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
}
