// flow-typed signature: 0f3548b9531963b5652e4e48ed55a9c0
// flow-typed version: 6c60df1018/datauri-download_v0.1.x/flow_>=v0.25.x

declare module "datauri-download" {
  declare module.exports: (
    filename: string,
    type: string,
    data: string | ArrayBuffer | Blob
  ) => void;
}
