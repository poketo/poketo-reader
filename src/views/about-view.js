// @flow

import React from 'react';
import Head from 'react-helmet';
import { Link } from 'react-router-dom';

import Header from '../components/home-header';
import Footer from '../components/home-footer';
import HomeLayout from '../components/home-layout';
import ScrollReset from '../components/scroll-reset';
import config from '../config';

const QuestionContainer = ({ id, question, children }) => (
  <div className="mb-4">
    <h3 className="fs-20 fw-semibold mb-3" id={id}>
      {question}
    </h3>
    {children}
  </div>
);

export default () => (
  <HomeLayout>
    <Head>
      <title>About</title>
    </Head>
    <Header />
    <ScrollReset />
    <div className="mw-500 mh-auto pt-4 pt-5-m">
      <div className="pv-4 ph-3 ph-0-m">
        <div className="Markdown">
          <p className="fs-24 mb-3 fw-semibold">
            Poketo is a web manga reader.
          </p>
          <p>
            A tool for following and reading series from across the web in one
            place. Like an{' '}
            <a href="https://en.wikipedia.org/wiki/RSS">RSS reader</a> but for
            manga.
          </p>
          <p className="pa-3 bgc-extraFadedLightCoral br-4">
            <span role="img" aria-label="Construction">
              🚧
            </span>{' '}
            Poketo is still in development. It's usable now, but there's still
            some rough parts. Watch your step!
          </p>
          <h2 className="mt-5 mb-3 fs-36 fw-semibold">Questions</h2>
          <QuestionContainer id="sites" question="What sites are supported?">
            <p>
              Currently, Poketo can read from{' '}
              <a
                href={config.githubSupportedSites}
                target="_blank"
                rel="noopener noreferrer">
                all the sites listed here
              </a>.
            </p>
            <p>
              If there's a site you want to see supported, leave an{' '}
              <a href={`${config.githubLibraryUrl}/issues/new`}>
                issue on Github
              </a>, or <Link to="/feedback">drop us a note</Link>.
            </p>
          </QuestionContainer>
          <QuestionContainer
            id="scanlators"
            question="How does reading on Poketo affect scanlators?">
            <p>
              Honestly, I'm not sure. I know a lot of work goes into translating
              series, and I don't want Poketo to take away from traffic, ad
              revenue or other ways scanlators support their work.
            </p>
            <p>
              I'm open to figuring something out though. If you're a scanlator
              and have opinions about how Poketo can help,{' '}
              <Link to="/feedback">reach out!</Link>
            </p>
          </QuestionContainer>
          <QuestionContainer
            id="mobile-desktop"
            question="Is this a mobile app?">
            <p>
              Poketo is built on the web, so it works on both mobile and
              desktop. Right now more love has been given to the mobile
              experience.
            </p>
          </QuestionContainer>
        </div>
        <Footer />
      </div>
    </div>
  </HomeLayout>
);
