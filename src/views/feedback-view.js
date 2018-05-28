// @flow

import React from 'react';
import Head from 'react-helmet';
import Loadable from 'react-loadable';

import ComponentLoader from '../components/loader-component';
import Header from '../components/home-header';
import HomeLayout from '../components/home-layout';

const LoadableFeedbackForm = Loadable({
  loader: () => import('../containers/feedback-form'),
  loading: ComponentLoader,
});

const FeedbackView = () => (
  <HomeLayout>
    <Head>
      <title>Feedback</title>
    </Head>
    <Header />
    <div className="mt-5 ph-3 mw-500 mh-auto">
      <LoadableFeedbackForm />
    </div>
  </HomeLayout>
);

export default FeedbackView;
