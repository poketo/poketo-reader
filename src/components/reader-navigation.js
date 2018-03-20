// @flow

import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Dropdown from '../components/dropdown';
import IconArrowLeft from '../components/icon-arrow-left';
import IconNewTab from '../components/icon-new-tab';
import utils from '../utils';
import type { Chapter, Series } from '../types';

type Props = {
  currentCollectionSlug: ?string,
  currentChapter: ?Chapter,
  currentSeries: ?Series,
  onChapterSelectChange: (e: SyntheticInputEvent<HTMLSelectElement>) => void,
};

type State = {
  isActive: boolean,
  scrollY: number,
};

export default class ReaderNavigation extends Component<Props, State> {
  state = {
    isActive: true,
    scrollY: 0,
  };

  frameId: AnimationFrameID;

  componentDidMount() {
    this.frameId = requestAnimationFrame(this.handleScroll);
  }

  componentWillUnmount() {
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
    }
  }

  handleScroll = () => {
    const scrollY = window.scrollY;

    if (scrollY === this.state.scrollY) {
      this.frameId = requestAnimationFrame(this.handleScroll);
      return;
    }

    let isActive = !(scrollY > this.state.scrollY && scrollY > 100);

    this.setState({ scrollY: scrollY, isActive });
    this.frameId = requestAnimationFrame(this.handleScroll);
  };

  render() {
    const {
      currentCollectionSlug,
      currentSeries,
      currentChapter,
      onChapterSelectChange,
    } = this.props;

    const { isActive } = this.state;

    const chapterSelectorOptions = currentSeries
      ? currentSeries.chapters.map(c => ({
          value: c.slug,
          label: `Chapter ${c.number}`,
        }))
      : [{ value: '', label: '' }];

    return (
      <nav
        style={{ position: 'sticky', top: 0, left: 0, right: 0, zIndex: 9 }}
        className={`ReaderNavigation ${
          isActive ? '' : 'ReaderNavigation--hidden'
        } bgc-black c-white x xa-center xj-end pv-3 ph-3 fs-14 fs-16-m`}>
        {currentChapter && (
          <Fragment>
            <div className="p-absolute t-0 b-0 l-0 x xj-center xa-center">
              <Dropdown
                value={currentChapter.slug}
                onChange={onChapterSelectChange}
                options={chapterSelectorOptions}
              />
            </div>
            <a
              className="x xa-center o-50p p-relative z-2"
              href={currentChapter.url}
              title="Open chapter on original site"
              target="_blank"
              rel="noopener noreferrer">
              <IconNewTab width={20} height={20} />
            </a>
          </Fragment>
        )}
      </nav>
    );
  }
}
