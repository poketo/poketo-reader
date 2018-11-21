// @flow

import React from 'react';
import Head from 'react-helmet';

import Header from '../components/home-header';
import Footer from '../components/home-footer';
import HomeLayout from '../components/home-layout';
import ScrollReset from '../components/scroll-reset';
import Markdown from '../components/markdown';
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
        <Markdown>
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
          <h2 id="questions" className="mt-5 mb-3 fs-36 fw-semibold">
            Questions
          </h2>
          <QuestionContainer id="sites" question="What sites are supported?">
            <p>
              Currently, Poketo can read from{' '}
              <a
                href={config.githubSupportedSites}
                target="_blank"
                rel="noopener noreferrer">
                all the sites listed here
              </a>
              .
            </p>
            <p>
              If there's a site you want to see supported, leave an{' '}
              <a href={`${config.githubLibraryUrl}/issues/new`}>
                issue on Github
              </a>
              , or <a href={`mailto:${config.email}`}>shoot us an email</a>.
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
          <QuestionContainer
            id="mobile-desktop"
            question="Can I use Poketo without an invite?">
            <p>
              You can! Poketo also provides a standalone reader. The simplest
              way to use it is via this bookmarklet. Using it on any supported
              site will open the chapter you're reading on Poketo:
            </p>
            <ul>
              <li>
                On a <strong>desktop computer</strong>, drag the following link
                to your bookmark bar:{' '}
                <a href={config.bookmarkletCode} title="Read on Poketo">
                  Read on Poketo
                </a>
              </li>
              <li>
                On <strong>mobile</strong>, it is a little more complicated.
                Follow this guide:{' '}
                <a
                  href={`${
                    config.githubWikiUrl
                  }/Adding-the-"Read-on-Poketo"-bookmarklet`}>
                  Adding the "Read on Poketo" bookmarklet
                </a>
                .
              </li>
            </ul>
          </QuestionContainer>
          <QuestionContainer
            id="scanlators"
            question="How does reading on Poketo affect scanlators?">
            <p>
              Not sure. Lots of effort goes into scanlating series, and we don't
              want Poketo to take away from traffic, ad revenue or other ways
              scanlators support their work.
            </p>
            <p>
              We're open to figuring something out though. If you're a scanlator
              and have opinions about how Poketo can help,{' '}
              <a href={`mailto:${config.email}`}>reach out!</a>
            </p>
          </QuestionContainer>
          <h2 id="help" className="mt-5 mb-3 fs-36 fw-semibold">
            Need help?
          </h2>
          <p>
            Some guides are available{' '}
            <a
              href={config.githubWikiUrl}
              target="_blank"
              rel="noreferrer noopener">
              on our wiki
            </a>
            . If you're having trouble with something, feel free to drop a note
            to <a href={`mailto:${config.email}`}>{config.email}</a>.
          </p>
        </Markdown>
        <Footer />
      </div>
    </div>
  </HomeLayout>
);
