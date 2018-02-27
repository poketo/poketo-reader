import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import utils from '../utils';

import SeriesPageImage from '../components/series-page-image';

export default class ReaderView extends Component {
  state = {
    chapter: null,
    isFetching: false,
  };

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    const { match } = this.props;
    const { collectionId, seriesId, chapterId } = match.params;

    this.setState({ isFetching: true });
    utils.fetchChapter(collectionId, seriesId, chapterId).then(response => {
      this.setState({ chapter: response.data, isFetching: false });
    });
  };

  render() {
    const { match } = this.props;
    const { chapter, isFetching } = this.state;
    const { collectionId } = match.params;

    if (isFetching || chapter === null) {
      return <div>Loading...</div>;
    }

    return (
      <div>
        <nav className="x xj-spaceBetween mv-4">
          <Link to={`/${collectionId}/`}>&larr; Back</Link>
          <a href={chapter.sourceUrl} target="_blank" rel="noopener noreferrer">
            Open
          </a>
        </nav>
        <div className="ta-center">
          {chapter.pages.map(page => (
            <div key={page.id} className="mb-2">
              <SeriesPageImage page={page} />
            </div>
          ))}
        </div>
        <nav className="x xj-center">
          <Link to={`/${collectionId}/`}>Back</Link>
        </nav>
      </div>
    );
  }
}
