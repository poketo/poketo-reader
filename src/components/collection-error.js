// @flow

import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

import config from '../config';
import CodeBlock from '../components/code-block';
import Markdown from '../components/markdown';
import type { ErrorCode } from '../store/types';

type Props = {
  errorCode: ErrorCode,
};

const CollectionErrorMessage = ({ errorCode }: Props) => {
  let title = 'Something went wrong.';
  let message = null;

  if (errorCode === 'NOT_FOUND') {
    title = 'Missing account.';
    message = (
      <Fragment>
        <p>
          We couldn't find a collection for this account.
          <br />
          <Link to="/logout">Log out</Link> and try again.
        </p>
      </Fragment>
    );
  } else if (errorCode === 'TIMED_OUT') {
    message = (
      <Fragment>
        Loading your collection took too long.{' '}
        <button className="Link" onClick={() => window.location.reload()}>
          Refresh to try again.
        </button>
      </Fragment>
    );
  } else {
    message = (
      <Fragment>
        <CodeBlock>{errorCode}</CodeBlock>
        <p>
          If you have a minute, please{' '}
          <a href={config.githubSiteIssueUrl} className="Link">
            report this as a bug.
          </a>
        </p>
      </Fragment>
    );
  }

  return (
    <Markdown>
      <h2 className="fw-semibold mb-2">{title}</h2>
      {message}
    </Markdown>
  );
};

export default CollectionErrorMessage;
