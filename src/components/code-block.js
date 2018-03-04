import React from 'react';

const CodeBlock = ({ children }) => (
  <pre className="CodeBlock pa-3 br-4"><code className="fs-12">{children}</code></pre>
);

export default CodeBlock;
