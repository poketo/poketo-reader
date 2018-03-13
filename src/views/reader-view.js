// @flow

import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Subscribe } from 'unstated';

import Spinner from '../components/spinner';
import Dropdown from '../components/dropdown';
import EntityContainer from '../containers/entity-container';
import SeriesPageImage from '../components/series-page-image';
import IconArrowLeft from '../components/icon-arrow-left';
import IconNewTab from '../components/icon-new-tab';
import utils from '../utils';

import type { Chapter, Series } from '../types';

type Props = {
  history: any,
  collectionSlug: ?string,
  siteId: string,
  seriesSlug: string,
  chapterSlug: string,
  store: any,
};

function getCollectionUrl(collectionSlug) {
  return `/c/${collectionSlug}`;
}

function getReaderUrl(collectionSlug, siteId, seriesSlug, chapterSlug) {
  return (
    '/' +
    utils.constructUrl(
      collectionSlug ? `c/${collectionSlug}` : null,
      'read',
      siteId,
      seriesSlug,
      chapterSlug,
    )
  );
}

const ChapterLink = ({
  collectionSlug,
  siteId,
  seriesSlug,
  chapter,
  children,
}) => {
  const disabled = !chapter;
  const to = getReaderUrl(
    collectionSlug,
    siteId,
    seriesSlug,
    chapter && chapter.slug,
  );

  return (
    <Link to={to} style={{ pointerEvents: disabled ? 'none' : 'auto' }}>
      {children}
    </Link>
  );
};

class ReaderView extends Component<Props> {
  componentDidMount() {
    this.loadData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const { siteId, seriesSlug, chapterSlug } = this.props;

    if (
      nextProps.siteId !== siteId ||
      nextProps.seriesSlug !== seriesSlug ||
      nextProps.chapterSlug !== chapterSlug
    ) {
      this.loadData(nextProps);
    }

    return;
  }

  loadData = props => {
    const { collectionSlug, siteId, seriesSlug, chapterSlug, store } = props;

    store.fetchChapterIfNeeded(siteId, seriesSlug, chapterSlug);
    store.fetchSeriesIfNeeded(siteId, seriesSlug);

    if (collectionSlug) {
      store.fetchCollectionIfNeeded(collectionSlug);
    }
  };

  handleChapterSelectorChange = (e: SyntheticInputEvent<HTMLSelectElement>) => {
    const {
      collectionSlug,
      siteId,
      seriesSlug,
      chapterSlug,
      history,
    } = this.props;
    const value = e.target.value;

    if (value !== chapterSlug) {
      history.push(getReaderUrl(collectionSlug, siteId, seriesSlug, value));
    }
  };

  render() {
    const {
      chapterSlug,
      seriesSlug,
      siteId,
      collectionSlug,
      store,
    } = this.props;

    const chapter: Chapter = store.findChapterBySlug(chapterSlug);
    const series: Series = store.findSeriesBySlug(seriesSlug);
    const isFetching = store.state.chaptersStatus.isFetching;

    const isLoading =
      isFetching ||
      chapter === null ||
      chapter === undefined ||
      chapter.pages === undefined;

    let chapterIndex;
    let previousChapter: ?Chapter = null;
    let nextChapter: ?Chapter = null;

    if (chapter && series) {
      chapterIndex = series.chapters.findIndex(c => c.id === chapter.id);
      previousChapter = series.chapters[chapterIndex + 1] || null;
      nextChapter = series.chapters[chapterIndex - 1] || null;
    }

    return (
      <div>
        <nav className="x xa-center xj-spaceBetween mv-4">
          {collectionSlug ? (
            <Link className="x xa-center" to={getCollectionUrl(collectionSlug)}>
              <IconArrowLeft
                style={{ marginRight: 4 }}
                width="1.2em"
                height="1.2em"
              />{' '}
              Back
            </Link>
          ) : (
            <div />
          )}
          {series && (
            <Dropdown
              value={chapterSlug}
              onChange={this.handleChapterSelectorChange}
              options={series.chapters.map(c => ({
                value: c.slug,
                label: `Chapter ${c.slug}`,
              }))}
            />
          )}
          {chapter && (
            <a
              className="x xa-center"
              href={chapter.url}
              target="_blank"
              rel="noopener noreferrer">
              Open <IconNewTab className="ml-2" width="1.2em" height="1.2em" />
            </a>
          )}
        </nav>
        {isLoading ? (
          <div className="ta-center pv-5">
            <div className="mb-4">
              <Spinner />
            </div>
            <div>Loading{series ? ` from ${series.site.name}` : ''}</div>
          </div>
        ) : (
          <Fragment>
            <div className="ta-center">
              {chapter.pages.map(page => (
                <div key={page.id} className="mb-2">
                  <SeriesPageImage page={page} />
                </div>
              ))}
            </div>
            <nav className="ta-center pv-4">
              {series ? (
                <div className="x xa-center xj-spaceBetween w-100p">
                  <ChapterLink
                    collectionSlug={collectionSlug}
                    siteId={siteId}
                    seriesSlug={seriesSlug}
                    chapter={previousChapter}>
                    Previous
                  </ChapterLink>
                  {series && (
                    <Dropdown
                      value={chapterSlug}
                      onChange={this.handleChapterSelectorChange}
                      options={series.chapters.map(c => ({
                        value: c.slug,
                        label: `Chapter ${c.slug}`,
                      }))}
                    />
                  )}
                  <ChapterLink
                    collectionSlug={collectionSlug}
                    siteId={siteId}
                    seriesSlug={seriesSlug}
                    chapter={nextChapter}>
                    Next
                  </ChapterLink>
                </div>
              ) : (
                series && (
                  <Dropdown
                    value={chapterSlug}
                    onChange={this.handleChapterSelectorChange}
                    options={series.chapters.map(c => ({
                      value: c.slug,
                      label: `Chapter ${c.slug}`,
                    }))}
                  />
                )
              )}
              {collectionSlug && (
                <div className="mt-4">
                  <Link to={getCollectionUrl(collectionSlug)}>Back</Link>
                </div>
              )}
            </nav>
          </Fragment>
        )}
      </div>
    );
  }
}

export default ({ match, history }: any) => (
  <Subscribe to={[EntityContainer]}>
    {store => (
      <ReaderView
        history={history}
        collectionSlug={match.params.collectionSlug}
        siteId={match.params.siteId}
        seriesSlug={match.params.seriesSlug}
        chapterSlug={match.params.chapterSlug}
        store={store}
      />
    )}
  </Subscribe>
);
