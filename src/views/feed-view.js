import React, { Component } from 'react';
import CodeBlock from '../components/code-block';
import Button from '../components/button';
import SeriesRow from '../components/series-row';
import utils from '../utils';

const mostRecent = arr => arr.reduce((a, b) => a.createdAt > b.createdAt ? a : b, {});
const leastRecent = arr => arr.reduce((a, b) => a.createdAt < b.createdAt ? a : b, {});

export default class FeedView extends Component {
  state = {
    isNotFound: false,
    isFetching: false,
    isError: false,
    isChangingList: false,
    errorMessage: null,
    series: [],
    newSeriesUrl: '',
  };

  componentDidMount() {
    const { match } = this.props;
    const { collectionId } = match.params;

    if (collectionId) {
      this.fetchData();
    }
  }

  handleAddClick = () => {
    this.setState({ isChangingList: true });
  };

  handleAddCancelClick = () => {
    this.setState({ isChangingList: false });
  };

  handleAddConfirmClick = () => {
    const { match } = this.props;
    const { newSeriesUrl } = this.state;
    const { collectionId } = match.params;

    if (!/^http(s)?:\/\//.test(newSeriesUrl)) {
      throw new Error(`Series URL is not a valid URL!`);
    }

    utils.addSeries(collectionId, newSeriesUrl).then(res => {
      const series = this.state.series.map(s => {
        if (s.slug === res.data.slug) {
          return { ...s, ...res.data };
        }
        return s;
      });

      this.setState({ series, isChangingList: false });
    });
  };

  handleNewSeriesUrlChange = e => {
    this.setState({ newSeriesUrl: e.target.value });
  };

  handleMarkAsReadClick = seriesId => () => {
    const { match } = this.props;
    const { collectionId } = match.params;

    utils.fetchMarkAsRead(collectionId, seriesId).then(res => {
      const series = this.state.series.map(s => {
        if (s.slug === res.data.slug) {
          return { ...s, ...res.data };
        }
        return s;
      });

      // NOTE: this call often triggers setState after the component has unmounted
      // and should be fixed by making the promise cancellable.
      this.setState({ series });
    });
  };

  handleSeriesClick = seriesId => e => {
    const { history, match } = this.props;
    const { collectionId } = match.params;

    const series = this.state.series.find(s => s.slug === seriesId);
    this.handleMarkAsReadClick(seriesId)();

    if (series.supportsReading !== true || series.chapters === undefined) {
      return;
    }

    e.preventDefault();

    const unreadChapters = series.chapters
      .filter(chapter => chapter.createdAt > series.lastReadAt);
    const toChapter = unreadChapters.length > 0
      ? leastRecent(unreadChapters)
      : mostRecent(series.chapters);

    history.push(`/${collectionId}/read/${series.slug}/${toChapter.id}`);
  };

  fetchData = () => {
    const { match } = this.props;
    const { collectionId } = match.params;

    this.setState({ isFetching: true });
    utils
      .fetchCollection(collectionId)
      .then(response => {
        this.setState({ series: response.data, isFetching: false });
      })
      .catch(err => {
        this.setState({
          isFetching: false,
          isNotFound: err.status === 404,
          isError: err.status !== 404,
          errorMessage: err.stack,
        });
      });
  };

  render() {
    const { match } = this.props;
    const { series, errorMessage, isChangingList, isError, isFetching, isNotFound } = this.state;
    const { collectionId } = match.params;

    if (isFetching) {
      return <div>Loading...</div>;
    }

    if (isNotFound) {
      return (
        <div>
          We couldn't find the manga collection at <code>/{collectionId}</code>.
        </div>
      );
    }

    if (isError) {
      return (
        <div>
          Something went wrong while loading.
          <CodeBlock>{errorMessage}</CodeBlock>
        </div>
      )
    }

    return (
      <div>
        {isChangingList && (
          <div className="p-fixed top-0 left-0 right-0 bottom-0 z-9 x xj-center xa-center bgc-fadedBlack">
            <div
              className="pa-4 bgc-white br-4"
              style={{ width: '100%', maxWidth: 400 }}>
              <div className="mb-3">
                <h2 className="fs-20 fw-normal mb-1">Add a new series</h2>
                <p className="fs-14">
                  Paste the series URL from{' '}
                  <a href="https://www.mangaupdates.com/">MangaUpdates</a>, and
                  the link you'd like to read it at.
                </p>
              </div>
              <div className="mb-2">
                <input
                  className="Input"
                  type="text"
                  placeholder="Series URL..."
                  onChange={this.handleNewSeriesUrlChange}
                />
              </div>
              <div className="x xj-end mt-3">
                <div>
                  <Button onClick={this.handleAddCancelClick}>Cancel</Button>
                </div>
                <div className="ml-1">
                  <Button onClick={this.handleAddConfirmClick}>Add</Button>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="mw-500">
          {collectionId ? (
            <div>
              {series.map(s => (
                <div key={s.slug} className="mb-3">
                  <SeriesRow
                    series={s}
                    onMarkAsReadClick={this.handleMarkAsReadClick}
                    onSeriesClick={this.handleSeriesClick}
                  />
                </div>
              ))}
              <div className="p-fixed bottom-16 right-16">
                <Button className="pa-3" onClick={this.handleAddClick}>
                  Add
                </Button>
              </div>
            </div>
          ) : (
            <div className="mw-500">
              <p>Hi!</p>
              <p className="mt-2">
                This is a friendly little site to help you track manga series
                you like.
              </p>
              <p className="mt-2">
                To get started,{' '}
                <button className="Link" onClick={this.handleAddClick}>
                  add a series
                </button>.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }
}
