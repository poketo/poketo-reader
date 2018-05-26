// @flow

import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

import Button from '../components/button';
import IconAdd from '../components/icon-add';
import IconDirectDown from '../components/icon-direct-down';
import IconPoketo from '../components/icon-poketo';
import Popover from '../components/popover/index';

type Props = {
  onAddButtonClick: (e: SyntheticMouseEvent<HTMLButtonElement>) => void,
};

export default class FeedHeader extends PureComponent<Props> {
  renderPopoverContent() {
    const { onAddButtonClick } = this.props;

    return (
      <div>
        <Button
          className="mb-1"
          ghost
          onClick={onAddButtonClick}
          iconBefore={
            <span
              className="x xa-center xj-center"
              style={{ width: 32, height: 44 }}>
              <IconAdd width={18} height={18} />
            </span>
          }>
          Add new series
        </Button>
        <Link to="/feedback">
          <Button ghost>Send feedback</Button>
        </Link>
      </div>
    );
  }
  render() {
    return (
      <header className="Navigation z-9 x xa-center xj-spaceBetween fs-14 fs-16-m bgc-fadedOffWhite status-bar-ios-offset">
        <div className="x xa-center pv-3 ph-3">
          <IconPoketo className="c-coral" />
        </div>
        <Popover
          content={this.renderPopoverContent()}
          position={Popover.Position.BOTTOM_LEFT}>
          <button className={classNames('x xa-center pv-3 ph-3')}>
            <IconDirectDown />
          </button>
        </Popover>
      </header>
    );
  }
}
