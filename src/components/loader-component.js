// @flow

import React from 'react';
import CircleLoader from '../components/loader-circle';

type Props = {};

const LoadingView = (props: Props) => (
  <div className="x xj-center xa-center">
    <CircleLoader />
  </div>
);

export default LoadingView;
