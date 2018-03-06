// @flow

import { Container } from 'unstated';

import utils from '../utils';

import type { Chapter, ChapterPreview } from '../types';

export type ChapterState = {
  chapters: { [id: string]: Chapter | ChapterPreview },
  errorMessage: ?string,
  isFetching: boolean,
};

export default class ChapterContainer extends Container<ChapterState> {
  state = {
    chapters: {},
    errorMessage: null,
    isFetching: false,
  };

  fetchChapter = (
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
