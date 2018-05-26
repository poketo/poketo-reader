// @flow

import React, { PureComponent } from 'react';
import classNames from 'classnames';
import Loadable from 'react-loadable';

import Button from './button';
import ComponentLoader from './loader-component';
import IconAdd from './icon-add';
import IconMessage from './icon-message';
import IconDirectDown from './icon-direct-down';
import IconPoketo from './icon-poketo';
import Panel from './panel';
import Popover from './popover/index';

const LoadableFeedbackForm = Loadable({
  loader: () => import('../containers/feedback-form'),
  loading: ComponentLoader,
});

type Props = {
  onAddButtonClick: (e: SyntheticMouseEvent<HTMLButtonElement>) => void,
};

type State = {
  isFeedbackPanelShown: boolean,
};

export default class FeedHeader extends PureComponent<Props, State> {
  state = {
    isFeedbackPanelShown: false,
  };

  openFeedbackPanel = () => {
    this.setState({ isFeedbackPanelShown: true });
  };

  closeFeedbackPanel = () => {
    this.setState({ isFeedbackPanelShown: false });
  };

  renderFeedbackPanel() {
    if (!this.state.isFeedbackPanelShown) {
      return null;
    }

    return (
      <Panel.Transition>
        <Panel onRequestClose={this.closeFeedbackPanel}>
          <div className="pa-3">
            <h3 className="fs-18 fw-semibold mb-2">Feedback</h3>
            <LoadableFeedbackForm />
          </div>
        </Panel>
      </Panel.Transition>
    );
  }

  renderPopoverContent() {
    const { onAddButtonClick } = this.props;

    return (
      <div style={{ maxWidth: '80vw' }}>
        <Button
          className="mb-1"
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
        <Button
          onClick={this.openFeedbackPanel}
          iconBefore={
            <span
              className="x xa-center xj-center"
              style={{ width: 32, height: 44 }}>
              <IconMessage width={18} height={18} />
            </span>
          }>
          Send feedback
        </Button>
      </div>
    );
  }
  render() {
    return (
      <header className="Navigation z-9 x xa-center xj-spaceBetween fs-14 fs-16-m bgc-fadedOffWhite status-bar-ios-offset">
        <div className="x xa-center pv-3 ph-3">
          <IconPoketo className="c-coral" />
        </div>
        <Panel.TransitionGroup>
          {this.renderFeedbackPanel()}
        </Panel.TransitionGroup>
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
