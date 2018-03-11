// @flow

import React, { type Node } from 'react';

type Props = {
  children: ?Node,
};

const CodeBlock = ({ children }: Props) => (
  <pre className="CodeBlock pa-3 br-4">
    <code className="fs-12">{children}</code>
  </pre>
);

export default CodeBlock;
