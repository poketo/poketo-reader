// @flow

import React, { Component } from 'react';
import { css } from 'react-emotion';
import Icon from '../components/icon';
import Panel from '../components/panel';
import ReaderChapterPicker from '../components/reader-chapter-picker';
import ReaderChapterLink from '../components/reader-chapter-link';
import utils from '../utils';

import type { ChapterMetadata } from 'poketo';
import type { Bookmark, Collection } from '../types';

type Props = {
  chapter: ChapterMetadata,
  collection: ?Collection,
  bookmark: ?Bookmark,
  seriesChapters: ChapterMetadata[],
};

type State = {
  showingPanel: boolean,
};

const contentClassName = css`
  overflow-y: scroll;
  max-height: 60vh;
  -webkit-overflow-scrolling: touch;

  @media only screen and (orientation: landscape) {
    max-height: 80vh;
  }
`;

const scrollElementIntoView = (el, parent) => {
  const top = el.offsetTop;
  const scrollTop = parent.scrollTop;
  const height = parent.offsetHeight;

  const start = scrollTop;
  const end = scrollTop + height;

  if (top > start && top < end) {
    return;
  } else if (top < start && top < end) {
    parent.scrollTop = Math.max(0, el.offsetTop - 60);
  } else if (top > end && top > start) {
    parent.scrollTop = el.offsetTop - height + 120;
  }
};

export default class ReaderNavigation extends Component<Props, State> {
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

  scrollRef = React.createRef();
  activeChapterRef = (el: HTMLElement) => {
    this.activeChapterEl = el;
  };
  activeChapterEl: HTMLElement;

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (
      prevState.showingPanel !== this.state.showingPanel &&
      this.state.showingPanel === true
    ) {
      const activeChapterEl = this.activeChapterEl;
      const scrollEl = this.scrollRef.current;

      if (scrollEl && activeChapterEl) {
        scrollElementIntoView(activeChapterEl, scrollEl);
      }
    }
  }

  renderPickerPanel() {
    const { chapter, bookmark, seriesChapters } = this.props;
    const { showingPanel } = this.state;

    return (
      <Panel
        isShown={showingPanel}
        onRequestClose={this.handlePickerPanelClose}
        scrollRef={this.scrollRef}>
        {() => (
          <div ref={this.scrollRef} className={contentClassName}>
            <div className="pt-2 pb-3">
              <ReaderChapterPicker
                activeChapterRef={this.activeChapterRef}
                activeChapterId={chapter.id}
                seriesChapters={seriesChapters}
                bookmark={bookmark}
                onChapterClick={this.handleChapterClick}
              />
            </div>
          </div>
        )}
      </Panel>
    );
  }

  render() {
    const { chapter, collection, seriesChapters } = this.props;

    const chapterIndex = seriesChapters.findIndex(c => c.id === chapter.id);
    const previousChapter = seriesChapters[chapterIndex + 1] || null;
    const nextChapter = seriesChapters[chapterIndex - 1] || null;

    const chapterLabel = utils.getChapterLabel(chapter, true);
    const chapterTitle = utils.getChapterTitle(chapter);

    return (
      <nav className="p-relative c-white x xa-center xj-spaceBetween mw-500 mh-auto pv-2 ph-2">
        <div className="z-2">
          <ReaderChapterLink
            collectionSlug={collection && collection.slug}
            chapter={previousChapter}>
            <Icon name="direct-left" />
          </ReaderChapterLink>
          {this.renderPickerPanel()}
        </div>
        <a
          className="PillLink pv-2 ph-3 d-inlineBlock c-white c-pointer ta-center lh-1d25"
          onClick={this.handlePickerClick}>
          <div className="x xa-center xj-center" css="line-height: 24px;">
            <span className="ml-1 mr-2">{chapterLabel}</span>
            <Icon name="direct-down" size={18} iconSize={18} />
          </div>
          {chapterTitle && (
            <div className="mt-1 fs-12 o-50p">{chapterTitle}</div>
          )}
        </a>
        <div className="z-2">
          <ReaderChapterLink
            collectionSlug={collection && collection.slug}
            chapter={nextChapter}>
            <Icon name="direct-right" />
          </ReaderChapterLink>
        </div>
      </nav>
    );
  }
}
