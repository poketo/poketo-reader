// @flow

import React, { Component } from 'react';

import Icon from '../components/icon';
import Panel from '../components/panel';
import ReaderChapterPicker from '../components/reader-chapter-picker';
import ReaderChapterLink from '../components/reader-chapter-link';
import utils from '../utils';

import type { Chapter, Series } from '../types';

type Props = {
  chapter: Chapter,
  collectionSlug: ?string,
  onChapterSelectChange: (e: SyntheticInputEvent<HTMLSelectElement>) => void,
  seriesChapters: Series,
};

type State = {
  showingPanel: boolean,
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

  renderPickerPanel() {
    const { chapter, onChapterSelectChange, seriesChapters } = this.props;

    if (this.state.showingPanel === false) {
      return null;
    }

    return (
      <Panel.Transition>
        <Panel onRequestClose={this.handlePickerPanelClose}>
          <div
            className="pt-3 pb-4"
            style={{
              overflowY: 'scroll',
              WebkitOverflowScrolling: 'touch',
              maxHeight: '60vh',
            }}>
            <Panel.Title className="ph-3 mb-2">Pick a chapter</Panel.Title>
            <ReaderChapterPicker
              chapter={chapter}
              seriesChapters={seriesChapters}
              onChapterClick={chapter => {
                onChapterSelectChange(chapter);
                this.handlePickerPanelClose();
              }}
            />
          </div>
        </Panel>
      </Panel.Transition>
    );
  }

  render() {
    const { chapter, collectionSlug, seriesChapters } = this.props;

    const chapterIndex = seriesChapters.findIndex(c => c.id === chapter.id);
    const previousChapter = seriesChapters[chapterIndex + 1] || null;
    const nextChapter = seriesChapters[chapterIndex - 1] || null;

    return (
      <nav className="p-relative c-white x xa-center xj-spaceBetween mw-500 mh-auto pv-2 ph-3">
        <div className="z-2">
          <ReaderChapterLink
            collectionSlug={collectionSlug}
            chapter={previousChapter}>
            <Icon name="direct-left" />
          </ReaderChapterLink>
          <Panel.TransitionGroup>
            {this.renderPickerPanel()}
          </Panel.TransitionGroup>
        </div>
        <a
          className="PillLink pv-2 ph-3 d-inlineBlock c-white c-pointer ta-center"
          style={{ lineHeight: '1.25' }}
          onClick={this.handlePickerClick}>
          <div className="x xa-center xj-center" style={{ lineHeight: '24px' }}>
            <span className="ml-1 mr-2">{utils.getChapterLabel(chapter)}</span>
            <Icon name="direct-down" size={18} iconSize={18} />
          </div>
          {utils.getChapterTitle(chapter) && (
            <div className="mt-1 fs-12 o-50p">
              {utils.getChapterTitle(chapter)}
            </div>
          )}
        </a>
        <div className="z-2">
          <ReaderChapterLink
            collectionSlug={collectionSlug}
            chapter={nextChapter}>
            <Icon name="direct-right" />
          </ReaderChapterLink>
        </div>
      </nav>
    );
  }
}
