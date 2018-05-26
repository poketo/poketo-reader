// @flow

import React from 'react';
import Head from 'react-helmet';

import Header from '../components/home-header';
import HomeLayout from '../components/home-layout';
import FeedbackForm from '../containers/feedback-form';

const FeedbackView = () => (
  <HomeLayout>
    <Head>
      <title>Feedback</title>
    </Head>
    <Header />
    <div className="mt-5 ph-3 mw-500 mh-auto">
      <FeedbackForm />
    </div>
  </HomeLayout>
);

export default FeedbackView;
