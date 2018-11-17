// @flow

const config: { [string]: string } = {
  apiBaseUrl: process.env.REACT_APP_API_BASE || '',
  apiFeedbackUrl: process.env.REACT_APP_API_FEEDBACK_URL || '',
  email: 'hello@poketo.app',
  bookmarkletCode:
    // eslint-disable-next-line
    'javascript:(function()%7Bvar s%3Ddocument.createElement(%27script%27)%3Bs.setAttribute(%27type%27,%27text/javascript%27)%3Bs.setAttribute(%27charset%27,%27UTF-8%27)%3Bs.setAttribute(%27src%27,%27https://poketo.app/bookmarklet.js%27)%3Bdocument.documentElement.appendChild(s)%3B%7D)()',
  discordInviteUrl: 'https://discord.gg/y5gVmY3',
  githubUrl: 'https://github.com/poketo',
  githubSiteUrl: 'https://github.com/poketo/poketo-reader',
  githubSiteIssueUrl: 'https://github.com/poketo/poketo-reader/issues/new',
  githubWikiUrl: 'https://github.com/poketo/poketo-reader/wiki',
  githubLibraryUrl: 'https://github.com/poketo/poketo',
  githubSupportedSites:
    'https://github.com/poketo/poketo/blob/master/README.md#supported-sites',
};

export default config;
