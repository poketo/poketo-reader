// @flow

import React, { PureComponent } from 'react';
import Loadable from 'react-loadable';

import Button from './button';
import ComponentLoader from './loader-component';
import Icon from './icon';
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
    const icon = <Icon name="add" iconSize={18} size={44} />;

    if (inline) {
      return (
        <Button inline noPadding onClick={onAddButtonClick} title={label}>
          {icon}
        </Button>
      );
    }

    return (
      <Popover.Item
        label={label}
        onClick={onAddButtonClick}
        iconBefore={icon}
      />
    );
  }

  renderFeedbackButton(inline: boolean = false) {
    const label = 'Send feedback';
    const icon = <Icon name="message" iconSize={18} size={44} />;

    if (inline) {
      return (
        <Button inline noPadding onClick={this.openFeedbackPanel} title={label}>
          {icon}
        </Button>
      );
    }

    return (
      <Popover.Item
        onClick={this.openFeedbackPanel}
        label={label}
        iconBefore={icon}
      />
    );
  }

  render() {
    return (
      <header className="FeedHeader z-9 x xa-center xj-spaceBetween pr-2 fs-14 fs-16-m bgc-fadedOffWhite status-bar-ios-offset">
        <div className="x xa-center pv-3 ph-3">
          <Icon name="poketo" className="c-coral" />
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
            <div className="pa-2" style={{ maxWidth: '80vw' }}>
              {this.renderAddButton()}
              {this.renderFeedbackButton()}
            </div>
          }
          position={Popover.Position.BOTTOM_RIGHT}>
          <div className="d-none-m">
            <Button inline noPadding>
              <Icon name="direct-down" size={44} />
            </Button>
          </div>
        </Popover>
      </header>
    );
  }
}
