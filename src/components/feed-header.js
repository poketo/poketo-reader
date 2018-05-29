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

import './feed-header.css';

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

  handleFeedbackSubmitSuccess = () => {
    setTimeout(() => {
      this.closeFeedbackPanel();
    }, 1000);
  };

  renderFeedbackPanel() {
    if (!this.state.isFeedbackPanelShown) {
      return null;
    }

    return (
      <Panel.Transition>
        <Panel onRequestClose={this.closeFeedbackPanel}>
          <Panel.Content title="Feedback">
            <LoadableFeedbackForm
              onSubmitSuccess={this.handleFeedbackSubmitSuccess}
            />
          </Panel.Content>
        </Panel>
      </Panel.Transition>
    );
  }

  renderAddButton(inline: boolean = false) {
    const { onAddButtonClick } = this.props;
    const label = 'Add new series';

    return (
      <Button
        className={classNames({ 'mb-1': !inline, 'ml-1': inline })}
        onClick={onAddButtonClick}
        inline={inline}
        noPadding={inline}
        title={label}
        iconBefore={
          <span
            className="x xa-center xj-center"
            style={{ width: inline ? 44 : 32, height: 44 }}>
            <IconAdd width={18} height={18} />
          </span>
        }>
        {inline ? null : label}
      </Button>
    );
  }

  renderFeedbackButton(inline: boolean = false) {
    const label = 'Send feedback';
    return (
      <Button
        onClick={this.openFeedbackPanel}
        inline={inline}
        noPadding={inline}
        title={label}
        iconBefore={
          <span
            className="x xa-center xj-center"
            style={{ width: inline ? 44 : 32, height: 44 }}>
            <IconMessage width={18} height={18} />
          </span>
        }>
        {inline ? null : label}
      </Button>
    );
  }

  render() {
    return (
      <header className="FeedHeader z-9 x xa-center xj-spaceBetween pr-2 fs-14 fs-16-m bgc-fadedOffWhite status-bar-ios-offset">
        <div className="x xa-center pv-3 ph-3">
          <IconPoketo className="c-coral" />
        </div>
        <Panel.TransitionGroup>
          {this.renderFeedbackPanel()}
        </Panel.TransitionGroup>
        <div className="d-none d-block-m">
          {this.renderFeedbackButton(true)}
          {this.renderAddButton(true)}
        </div>
        <Popover
          content={
            <div style={{ maxWidth: '80vw' }}>
              {this.renderAddButton()}
              {this.renderFeedbackButton()}
            </div>
          }
          position={Popover.Position.BOTTOM_RIGHT}>
          <div className="d-none-m">
            <Button inline noPadding>
              <span
                className="x xa-center xj-center"
                style={{ width: 44, height: 44 }}>
                <IconDirectDown />
              </span>
            </Button>
          </div>
        </Popover>
      </header>
    );
  }
}
