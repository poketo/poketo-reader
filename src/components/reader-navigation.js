// @flow

import React, { Component, Fragment } from 'react';
import { css, cx } from 'react-emotion/macro';
import Icon from '../components/icon';
import Panel from '../components/panel';
import ReaderChapterPicker from '../components/reader-chapter-picker';
import ReaderChapterLink from '../components/reader-chapter-link';
import { BookmarkContext } from '../views/reader-view';
import utils from '../utils';

import type { ChapterMetadata, Series } from 'poketo';

type Props = {
  chapter: ChapterMetadata,
  series: ?Series,
  seriesChapters: ChapterMetadata[],
  showNextPreviousLinks?: boolean,
};

type State = {
  showingPanel: boolean,
};

const pickerClassName = css`
  max-width: 70vw;
  line-height: 1.5;
`;

const contentClassName = css`
  max-height: 60vh;
   @media only screen and (orientation: landscape) {
    max-height: 80vh;
  }
`;

export default class ReaderNavigation extends Component<Props, State> {
  static defaultProps = {
    showNextPreviousLinks: false,
  };

  state = {
    showingPanel: false,
  };

  handlePickerClick = () => {
    this.setState({ showingPanel: true });
  };

  handlePickerPanelClose = () => {
    this.setState({ showingPanel: false });
  };

  handleChapterClick = () => {
    this.handlePickerPanelClose();
  };

  listRef = React.createRef<*>();

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (
      prevState.showingPanel !== this.state.showingPanel &&
      this.state.showingPanel === true
    ) {
      const listEl = this.listRef.current;

      if (listEl) {
        const index = this.props.seriesChapters.findIndex(
          c => c.id === this.props.chapter.id,
        );
        listEl.scrollToItem(index, 'center');
      }
    }
  }

  renderPickerPanel() {
    const { chapter, seriesChapters } = this.props;
    const { showingPanel } = this.state;

    return (
      <Panel
        isShown={showingPanel}
        onRequestClose={this.handlePickerPanelClose}>
        {() => (
          <BookmarkContext.Consumer>
            {bookmark => (
              <ReaderChapterPicker
                className={contentClassName}
                innerRef={this.listRef}
                bookmark={bookmark}
                activeChapterId={chapter.id}
                seriesChapters={seriesChapters}
                onChapterClick={this.handleChapterClick}
              />
            )}
          </BookmarkContext.Consumer>
        )}
      </Panel>
    );
  }

  render() {
    const {
      series,
      chapter,
      seriesChapters,
      showNextPreviousLinks,
    } = this.props;

    const chapterIndex = seriesChapters.findIndex(c => c.id === chapter.id);
    const previousChapter = seriesChapters[chapterIndex + 1] || null;
    const nextChapter = seriesChapters[chapterIndex - 1] || null;

    const chapterLabel = utils.getChapterLabel(chapter, true);
    const chapterTitle = utils.getChapterTitle(chapter);

    return (
      <nav className="p-relative c-white x xa-center xj-spaceBetween mw-500 mh-auto pv-2 ph-2">
        <div className="z-2">
          {showNextPreviousLinks && (
            <ReaderChapterLink chapter={previousChapter}>
              <Icon name="direct-left" />
            </ReaderChapterLink>
          )}
          {this.renderPickerPanel()}
        </div>

        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a
          className={cx(
            'PillLink pv-2 ph-3 d-inlineBlock ta-center c-white c-pointer',
            pickerClassName,
          )}
          onClick={this.handlePickerClick}>
          {series && (
            <div className="fs-12 o-50p of-hidden to-ellipsis ws-noWrap">
              {series.title}
            </div>
          )}
          <div className="x xa-center xj-center w-100p fs-14">
            <span className="mh-1 of-hidden to-ellipsis ws-noWrap">
              {chapterLabel}
              {chapterTitle && (
                <Fragment>
                  {': '}
                  {chapterTitle}
                </Fragment>
              )}
            </span>
            <Icon name="direct-down" size={14} iconSize={14} />
          </div>
        </a>
        {showNextPreviousLinks && (
          <div className="z-2">
            <ReaderChapterLink chapter={nextChapter}>
              <Icon name="direct-right" />
            </ReaderChapterLink>
          </div>
        )}
      </nav>
    );
  }
}
