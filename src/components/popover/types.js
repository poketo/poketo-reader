// @flow

import type { ElementType } from 'react';

// Taken from https://github.com/facebook/react/blob/76e07071a11cd6e4796ad846bc835a18c8f49647/packages/shared/ReactTypes.js#L105-L107
export type RefObject = {|
  current: null | React$ElementRef<ElementType>,
|};
