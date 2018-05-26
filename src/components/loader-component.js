// @flow

import React from 'react';
import CircleLoader from '../components/loader-circle';

type Props = {
  pastDelay: boolean,
};

const LoadingView = (props: Props) =>
  props.pastDelay ? (
    <div className="x xj-center xa-center mh-100vh">
      <CircleLoader />
    </div>
  ) : null;

export default LoadingView;
