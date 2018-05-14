// @flow

const invariant = val => {
  if (Boolean(val)) {
    return;
  }

  throw new TypeError();
};

invariant(process.env.REACT_APP_API_BASE);
invariant(process.env.REACT_APP_INVITE_API_URL);

const config: { [string]: string } = {
  email: 'hello@poketo.app',
  apiBaseUrl: process.env.REACT_APP_API_BASE,
  inviteUrl: process.env.REACT_APP_INVITE_API_URL,
  githubUrl: 'https://github.com/poketo',
  githubSiteUrl: 'https://github.com/poketo/site',
  githubServiceUrl: 'https://github.com/poketo/service',
  githubLibraryUrl: 'https://github.com/poketo/poketo',
  githubSupportedSites:
    'https://github.com/poketo/poketo/blob/master/README.md#supported-sites',
};

export default config;
