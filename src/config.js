// @flow

const config: { [string]: string } = {
  apiBaseUrl: process.env.REACT_APP_API_BASE || '',
  apiFeedbackUrl: process.env.REACT_APP_API_FEEDBACK_URL || '',
  email: 'hello@poketo.app',
  discordInviteUrl: 'https://discord.gg/y5gVmY3',
  githubUrl: 'https://github.com/poketo',
  githubSiteUrl: 'https://github.com/poketo/site',
  githubSiteIssueUrl: 'https://github.com/poketo/site/issues/new',
  githubServiceUrl: 'https://github.com/poketo/service',
  githubLibraryUrl: 'https://github.com/poketo/poketo',
  githubSupportedSites:
    'https://github.com/poketo/poketo/blob/master/README.md#supported-sites',
};

export default config;
