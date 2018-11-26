// @flow

import React, { Component, Fragment, type Node } from 'react';
import { connect } from 'react-redux';
import { normalize } from 'normalizr';
import isSupportedUrl from 'poketo/supports';
import debounce from 'throttle-debounce/debounce';
import Button from '../components/button';
import Input from '../components/input';
import Panel from '../components/panel';
import SeriesPreview from '../components/series-preview';
import api, { type AxiosError } from '../api';
import config from '../config';
import utils from '../utils';

import schema from '../store/schema';
import { getCollectionSlug } from '../store/reducers/navigation';

import type { Series } from 'poketo';
import type { Dispatch, EntitiesPayload } from '../store/types';

type NewSeriesErrorCode =
  | 'REQUEST_FAILED'
  | 'INVALID_SERIES'
  | 'INVALID_URL'
  | 'UNSUPPORTED_SITE'
  | 'SERIES_NOT_FOUND'
  | 'SERIES_ALREADY_EXISTS'
  | 'UNKNOWN_ERROR';

type BookmarkFetchState =
  | 'READY' // Valid input, ready to submit
  | 'SUBMITTING' // Valid input, submission in-progress
  | 'SUBMITTED' // Valid input, submission completed
  | 'UNREADY'; // Invalid input, not ready to submit

type Props = {
  addEntities: (entities: EntitiesPayload) => void,
  collectionSlug: string,
  onRequestClose: () => void,
};

type State = {
  bookmarkFetchState: BookmarkFetchState,
  errorCode: ?NewSeriesErrorCode,
  isFetchingPreview: boolean,
  linkToUrl: ?string,
  seriesUrl: string,
  seriesPreview: ?Series,
};

const seriesSupportsReading = (seriesUrl: string) => {
  return !/mangaupdates/i.test(seriesUrl);
};

const buttonLabelValues = {
  SUBMITTING: 'Adding...',
  READY: 'Add',
  UNREADY: 'Add',
  SUBMITTED: <span>✓ Added</span>,
};

const shouldValidateUrl = (url: string) => {
  if (url.length < 5) {
    return false;
  }

  return true;
};

const isValidUrl = (url: string) => {
  if (!shouldValidateUrl(url)) {
    return false;
  }

  const normalizedUrl = utils.normalizeUrl(url);

  return utils.isUrl(normalizedUrl) && isSupportedUrl(normalizedUrl);
};

const getUrlErrorCode = (url: string): NewSeriesErrorCode | null => {
  const normalizedUrl = utils.normalizeUrl(url);

  if (!utils.isUrl(normalizedUrl)) {
    return 'INVALID_URL';
  }

  if (!isSupportedUrl(normalizedUrl)) {
    return 'UNSUPPORTED_SITE';
  }

  return null;
};

const getHttpErrorCode = (err: AxiosError): NewSeriesErrorCode => {
  if (!err.response) {
    return 'REQUEST_FAILED';
  }

  if (err.response.status === 404) {
    return 'SERIES_NOT_FOUND';
  }

  if (err.response.status === 400) {
    switch (err.response.data.code) {
      case undefined:
        return /already exists/i.test(err.response.data.message)
          ? 'SERIES_ALREADY_EXISTS'
          : 'INVALID_SERIES';
      default:
        return 'INVALID_SERIES';
    }
  }

  return 'UNKNOWN_ERROR';
};

const getErrorMessage = (errorCode: NewSeriesErrorCode, url: string): Node => {
  switch (errorCode) {
    case 'REQUEST_FAILED':
      return `There was an error reaching the server.`;
    case 'INVALID_URL':
      return `Hmm, this doesn't look like a URL.`;
    case 'UNSUPPORTED_SITE':
      const domain = utils.isUrl(url) ? utils.getDomainName(url) : null;
      return (
        <span>
          Sorry,{' '}
          {domain && domain.length > 0 ? <strong>{domain}</strong> : 'that'}{' '}
          isn't a supported site. Here's{' '}
          <a
            className="Link"
            href={`${config.githubLibraryUrl}#supported-sites`}
            rel="noopener noreferrer"
            target="_blank">
            a full list of supported sites
          </a>
          . Make an issue{' '}
          <a
            className="Link"
            href={`${config.githubLibraryUrl}/issues/new`}
            rel="noopener noreferrer"
            target="_blank">
            on the Github repo
          </a>{' '}
          to request a new one.
        </span>
      );
    case 'INVALID_SERIES':
    case 'SERIES_NOT_FOUND':
      return `We couldn't find a series at that URL.`;
    case 'SERIES_ALREADY_EXISTS':
      return `That series is already in your collection!`;
    case 'UNKNOWN_ERROR':
      return `Something went wrong fetching the series. Try again later.`;
    default:
      return `Something went wrong.`;
  }
};

class NewBookmarkPanel extends Component<Props, State> {
  state = {
    bookmarkFetchState: 'UNREADY',
    errorCode: null,
    isFetchingPreview: false,
    linkToUrl: undefined,
    seriesUrl: '',
    seriesPreview: null,
  };

  handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { addEntities, collectionSlug, onRequestClose } = this.props;
    const { bookmarkFetchState, errorCode, seriesUrl, linkToUrl } = this.state;

    if (bookmarkFetchState === 'SUBMITTING') {
      return;
    }

    this.handleSeriesUrlValidation();

    if (errorCode || !seriesUrl) {
      return;
    }

    this.setState({ bookmarkFetchState: 'SUBMITTING' });

    api
      .fetchAddBookmarkToCollection(
        collectionSlug,
        utils.normalizeUrl(seriesUrl),
        linkToUrl ? utils.normalizeUrl(linkToUrl) : null,
        null,
      )
      .then(response => {
        const normalized = normalize(response.data, {
          collection: schema.collection,
          series: schema.series,
        });

        addEntities(normalized.entities);
        this.setState({ bookmarkFetchState: 'SUBMITTED' });
        setTimeout(() => {
          onRequestClose();
        }, 1000);
      })
      .catch(this.handleSubmitError);
  };

  handleSubmitError = (err: AxiosError) => {
    const errorCode = getHttpErrorCode(err);
    this.setState({ bookmarkFetchState: 'UNREADY', errorCode });
  };

  handleSeriesUrlValidation = () => {
    const { seriesUrl } = this.state;

    if (!seriesUrl || !shouldValidateUrl(seriesUrl)) {
      this.setState({ errorCode: null, bookmarkFetchState: 'UNREADY' });
      return;
    }

    const errorCode = getUrlErrorCode(seriesUrl);

    this.setState({
      errorCode,
      bookmarkFetchState: errorCode === null ? 'READY' : 'UNREADY',
    });
  };

  fetchPreview = (seriesUrl: string) => {
    if (this.state.isFetchingPreview) {
      // If we're fetching, that means we're already checking and don't have
      // anything new to share.
      return;
    }

    if (!isValidUrl(seriesUrl)) {
      return;
    }

    this.setState({
      errorCode: null,
      isFetchingPreview: true,
    });

    api
      .fetchSeriesByUrl(seriesUrl)
      .then(response => {
        this.setState({
          isFetchingPreview: false,
          seriesPreview: response.data,
        });
      })
      .catch(err => {
        this.setState({
          isFetchingPreview: false,
          seriesPreview: null,
        });
      });
  };

  debouncedSeriesUrlValidation = debounce(500, this.handleSeriesUrlValidation);
  debouncedFetchSeriesPreview = debounce(550, this.fetchPreview);

  handleSeriesUrlChange = (e: SyntheticEvent<HTMLInputElement>) => {
    const seriesUrl = e.currentTarget.value;
    this.setState({ seriesUrl });
    this.debouncedSeriesUrlValidation();
    if (seriesUrl !== this.state.seriesUrl) {
      this.debouncedFetchSeriesPreview(seriesUrl);
    }
  };

  handleLinkToUrlChange = (e: SyntheticEvent<HTMLInputElement>) => {
    this.setState({ linkToUrl: e.currentTarget.value });
    // TODO: add validation that this is a valid URL
  };

  render() {
    const {
      bookmarkFetchState,
      errorCode,
      isFetchingPreview,
      linkToUrl,
      seriesPreview,
      seriesUrl,
    } = this.state;

    const disableFormFields =
      bookmarkFetchState === 'SUBMITTING' || bookmarkFetchState === 'SUBMITTED';
    const showLinkToForm =
      seriesUrl &&
      utils.isUrl(seriesUrl) &&
      seriesSupportsReading(seriesUrl) === false;

    return (
      <Panel.Content title="Follow new series">
        <p className="mb-3">
          Paste the URL of the series to follow, or read our{' '}
          <a
            href="https://github.com/poketo/site/wiki/Adding-a-New-Series"
            target="_blank"
            className="Link"
            rel="noopener noreferrer">
            guide to following series
          </a>{' '}
          for help.
        </p>
        <form type="post" onSubmit={this.handleSubmit} noValidate>
          {(seriesPreview || isFetchingPreview) && (
            <div className="mb-3">
              <SeriesPreview
                isFetching={isFetchingPreview}
                series={seriesPreview}
              />
            </div>
          )}
          <div className="mb-2">
            <Input
              type="url"
              name="seriesUrl"
              readOnly={disableFormFields}
              onChange={this.handleSeriesUrlChange}
              placeholder="http://example.com/manga/"
              value={seriesUrl}
            />
          </div>
          {errorCode && (
            <p className="c-red fs-12 mb-2">
              {getErrorMessage(errorCode, seriesUrl)}
            </p>
          )}
          {seriesUrl &&
            showLinkToForm && (
              <Fragment>
                <p className="mb-2">
                  <strong>{utils.getDomainName(seriesUrl)}</strong> doesn't
                  support reading on Poketo. You can add a different link to
                  open for reading.
                </p>
                <Input
                  type="url"
                  name="linkToUrl"
                  readOnly={disableFormFields}
                  onChange={this.handleLinkToUrlChange}
                  placeholder="Reading URL (optional)"
                  value={linkToUrl || ''}
                />
              </Fragment>
            )}
          <Button
            variant="primary"
            disabled={bookmarkFetchState !== 'READY' || errorCode !== null}
            type="submit">
            {buttonLabelValues[bookmarkFetchState]}
          </Button>
        </form>
      </Panel.Content>
    );
  }
}

const mapStateToProps = state => {
  const collectionSlug = getCollectionSlug(state);
  return { collectionSlug };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  addEntities(payload) {
    dispatch({ type: 'ADD_ENTITIES', payload });
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NewBookmarkPanel);
