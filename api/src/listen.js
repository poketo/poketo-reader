// @flow

export default function listen<S: { listen: Function }>(
  server: S,
  port: string,
): Promise<S> {
  return new Promise((resolve, reject) => {
    server.listen(port, err => {
      if (err) {
        reject(err);
      }
      resolve(server);
    });
  });
}
