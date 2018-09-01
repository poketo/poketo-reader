const { rewireEmotion } = require('react-app-rewire-emotion');

module.exports = (config, env) => {
  return rewireEmotion(config, env, { inline: true });
};
