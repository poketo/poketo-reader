import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import App from './app';
import getStore from './store';
import serviceWorker from './service-worker';

getStore().then(store => {
  ReactDOM.render(
    <Router>
      <Provider store={store}>
        <App />
      </Provider>
    </Router>,
    document.getElementById('root'),
  );
});

serviceWorker.register({
  onUpdate: registration => {
    // store.dispatch()
  },
});
