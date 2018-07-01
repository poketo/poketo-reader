import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import App from './app';
import getStore from './store';
import serviceWorker from './service-worker';

const rootEl = document.getElementById('root');

getStore().then(store => {
  const app = (
    <Router>
      <Provider store={store}>
        <App />
      </Provider>
    </Router>
  );

  if (rootEl.hasChildNodes()) {
    ReactDOM.hydrate(app, rootEl);
  } else {
    ReactDOM.render(app, rootEl);
  }
});

serviceWorker.register();
