// @flow

import React from 'react';
import IconAdd from '../components/icon-add';
import IconPoketo from '../components/icon-poketo';

type Props = {
  onAddButtonClick: (e: SyntheticMouseEvent<HTMLButtonElement>) => void,
};

const FeedHeader = (props: Props) => (
  <header className="Navigation p-fixed t-0 l-0 r-0 z-9 x xa-center xj-spaceBetween fs-14 fs-16-m bgc-fadedOffWhite">
    <div className="x xa-center pv-3 ph-3">
      <IconPoketo className="c-coral" />
    </div>
    <button className="x xa-center pv-3 ph-3" onClick={props.onAddButtonClick}>
      <IconAdd />
    </button>
  </header>
);

export default FeedHeader;
