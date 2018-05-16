// @flow

import React from 'react';
import Head from 'react-helmet';
import HomeLayout from '../components/home-layout';

export default () => (
  <HomeLayout>
    <Head>
      <title>Not found</title>
    </Head>
    <div className="pa-3 x xa-center xj-center">
      <p>Page not found</p>
    </div>
  </HomeLayout>
);
