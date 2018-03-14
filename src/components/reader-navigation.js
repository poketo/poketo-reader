// @flow

import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Dropdown from '../components/dropdown';
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

    return (
      <nav
        style={{ position: 'sticky', top: 0, left: 0, right: 0, zIndex: 9 }}
        className={`ReaderNavigation ${
          isActive ? '' : 'ReaderNavigation--hidden'
        } bgc-black c-white x xa-center xj-spaceBetween pv-3 ph-3 fs-14 fs-16-m`}>
        {currentCollectionSlug ? (
          <Link
            className="o-50p p-relative z-2"
            to={utils.getCollectionUrl(currentCollectionSlug)}>
            Collection
          </Link>
        ) : (
          <div />
        )}
        {currentChapter && (
          <Fragment>
            {currentSeries ? (
              <div className="p-absolute x xj-center xa-center l-0 r-0 t-0 b-0 ta-center z-1">
                <Dropdown
                  value={currentChapter.slug}
                  onChange={onChapterSelectChange}
                  options={currentSeries.chapters.map(c => ({
                    value: c.slug,
                    label: `Chapter ${c.slug}`,
                  }))}
                />
              </div>
            ) : (
              <div />
            )}
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
