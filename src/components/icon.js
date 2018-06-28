// @flow

import React, { PureComponent } from 'react';
import classNames from 'classnames';

const Icons = {
  add: require('./icon-add').default,
  'arrow-left': require('./icon-arrow-left').default,
  'arrow-right': require('./icon-arrow-right').default,
  book: require('./icon-book').default,
  bookmark: require('./icon-bookmark').default,
  'check-circle': require('./icon-check-circle').default,
  check: require('./icon-check').default,
  'direct-down': require('./icon-direct-down').default,
  'direct-left': require('./icon-direct-left').default,
  'direct-right': require('./icon-direct-right').default,
  edit: require('./icon-edit').default,
  feed: require('./icon-feed').default,
  message: require('./icon-message').default,
  'more-horizontal': require('./icon-more-horizontal').default,
  'new-tab': require('./icon-new-tab').default,
  poketo: require('./icon-poketo').default,
  refresh: require('./icon-refresh').default,
  trash: require('./icon-trash').default,
};

type IconKey = $Keys<typeof Icons>;

type Props = {
  className?: string,
  name: IconKey,
  iconSize: number,
  size: number,
};

export default class Icon extends PureComponent<Props> {
  static defaultProps = {
    iconSize: 24,
    size: 24,
  };

  render() {
    const { className, name, iconSize, size } = this.props;
    const Component = Icons[name];

    return (
      <span
        className={classNames('xj-center xa-center', className)}
        style={{ display: 'inline-flex', width: size, height: size }}>
        <Component width={iconSize} height={iconSize} />
      </span>
    );
  }
}
