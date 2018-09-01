// @flow

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import cx from 'classnames';
import { fetchSeriesIfNeeded } from '../store/reducers/series';
import CoverImage from '../components/series-cover-image';
import CircleLoader from '../components/loader-circle';
import ChapterRow from '../components/chapter-row';
import FollowButton from '../components/follow-button';
import Icon from '../components/icon';
import type { Dispatch } from '../store/types';
import type { Series, Chapter } from '../types';

type Props = {
  series: Series,
  chapters: Chapter[],
};

type ContainerProps = {
  dispatch: Dispatch,
  isFetching: boolean,
  errorCode: string,
  match: Object,
};

class SeriesPageContainer extends Component<ContainerProps> {
  componentDidMount() {
    const { match, dispatch } = this.props;
    dispatch(fetchSeriesIfNeeded(match.params.seriesId));
  }

  componentDidUpdate(prevProps) {
    const { match: prevMatch } = prevProps;
    const { match, dispatch } = this.props;

    if (prevMatch.params.seriesId !== match.params.seriesId) {
      dispatch(match.params.seriesId);
    }
  }

  render() {
    if (this.props.errorCode) {
      return this.props.errorCode;
    }

    if (this.props.isFetching) {
      return <CircleLoader />;
    }

    return <ConnectedSeriesPage seriesId={this.props.match.params.seriesId} />;
  }
}

const Label = ({ className, ...props }: { className?: string }) => (
  <div className={cx(className, 'fs-14 c-gray3 mb-1')} {...props} />
);

const SeriesPage = ({ series, chapters }: Props) => (
  <div className="pt-4 pb-6">
    <div className="mw-600 mh-auto ph-3">
      <header className="x xj-spaceBetween mb-2">
        <Link to="/">
          <Icon name="arrow-left" iconSize={20} size={20} />
        </Link>

        <div>
          <Icon name="more-vertical" iconSize={20} size={20} />
        </div>
      </header>
      <header className="x xa-end mb-4">
        <div className="x-1 mr-3" style={{ maxWidth: 100 }}>
          <CoverImage series={series} />
        </div>
        <div>
          <h1 className="fs-24 fw-semibold">{series.title}</h1>
          <a
            href={series.url}
            className="c-gray3"
            target="_blank"
            rel="noopener noreferrer">
            {series.site.name}
            <Icon name="new-tab" size={16} iconSize={16} />
          </a>
        </div>
      </header>
      <div className="mb-4">
        <FollowButton seriesId={series.id} />
      </div>
      <div className="mb-4">
        <div className="mb-3">
          <Label>Author</Label>
          <div>{series.author}</div>
        </div>
        <div>
          <Label>Description</Label>
          <div>{series.description}</div>
        </div>
      </div>
      <div>
        {series.supportsReading ? (
          chapters.map(chapter => (
            <div className="bb-1 bc-gray1">
              <ChapterRow key={chapter.id} chapter={chapter} />
            </div>
          ))
        ) : (
          <div className="bgc-gray0 ta-center br-3 ph-4 pv-4">
            <Icon name="warning" className="mb-3" />
            <div className="mb-3 fw-semibold">No chapters</div>
            <p className="c-gray4">
              {series.site.name} doesn't support reading on Poketo.
            </p>
          </div>
        )}
      </div>
    </div>
  </div>
);

const mapStateToProps = (state, ownProps) => {
  const { series: seriesById, chapters: chaptersById } = state;
  const { seriesId } = ownProps;

  const series = seriesById[seriesId];
  const chapters = series.chapters
    ? series.chapters.map(chapterId => chaptersById[chapterId])
    : [];

  return { series, chapters };
};

const ConnectedSeriesPage = connect(mapStateToProps)(SeriesPage);

export default withRouter(
  connect((state, ownProps) => {
    const { series: seriesById } = state;
    const { seriesId } = ownProps.match.params;

    const status = seriesById._status[seriesId];

    if (status === undefined) {
      return { isFetching: true };
    }

    const isFetching = status.fetchStatus === 'fetching';
    const errorCode = status.errorCode || seriesById[seriesId] === undefined;

    return { isFetching, errorCode };
  })(SeriesPageContainer),
);
