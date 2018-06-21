// flow-typed signature: 49d96e66c37fb4cbb459d19937bc6011
// flow-typed version: da30fe6876/react-body-classname_v1.x.x/flow_>=v0.53.x

import React from "react";
declare module "react-body-classname" {
  declare type Props = {
    children?: React.ChildrenArray<any>,
    className: string
  };
  declare class BodyClassName extends React$Component<Props> {
    static rewind(): string;
  }
  declare module.exports: typeof BodyClassName;
}
