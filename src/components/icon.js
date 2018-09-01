// @flow

import React, { PureComponent } from 'react';
import { cx } from 'react-emotion';

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
  flag: require('./icon-flag').default,
  image: require('./icon-image').default,
  message: require('./icon-message').default,
  'more-horizontal': require('./icon-more-horizontal').default,
  'more-vertical': require('./icon-more-vertical').default,
  'new-tab': require('./icon-new-tab').default,
  poketo: require('./icon-poketo').default,
  refresh: require('./icon-refresh').default,
  trash: require('./icon-trash').default,
  warning: require('./icon-warning').default,
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
        className={cx('xj-center xa-center', className)}
        css={`
          display: inline-flex;
          width: ${size}px;
          height: ${size}px;
        `}>
        <Component width={iconSize} height={iconSize} />
      </span>
    );
  }
}
