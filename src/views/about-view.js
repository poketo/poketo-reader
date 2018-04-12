// @flow

import React from 'react';
import Head from 'react-helmet';
import { Link } from 'react-router-dom';

import IconPoketo from '../components/icon-poketo';
import IconPoketoWordmark from '../components/icon-poketo-wordmark';

const HEADER_CLASS_NAMES = 'fs-20 fw-medium mb-3';
const QUESTION_CLASS_NAMES = 'mb-4';
const PARAGRAPH_CLASS_NAMES = 'mb-3 c-gray4';

export default () => (
  <div className="bgc-offwhite">
    <Head>
      <title>About</title>
    </Head>
    <div className="mw-900 mh-auto pv-4 ph-3 ph-0-m">
      <Link to="/">
        <div className="x xa-center c-coral">
          <IconPoketo />
          <IconPoketoWordmark
            width={100}
            height={32}
            style={{ marginLeft: 8 }}
          />
        </div>
      </Link>
    </div>
    <div className="mw-500 mh-auto pv-4 ph-3 ph-0-m">
      <div className={QUESTION_CLASS_NAMES}>
        <h2 className={HEADER_CLASS_NAMES} id="accounts">
          How do I sign up? Where are the accounts?
        </h2>
        <p className={PARAGRAPH_CLASS_NAMES}>
          <em>
            Right now Poketo is in a private beta. Hit me up for an invite!
          </em>
        </p>
        <p className={PARAGRAPH_CLASS_NAMES}>
          There are no accounts! Over the past few years, the web has become a
          weird corporate place, with everybody asking for your email. It's a
          small piece of the larger problem of people not being in control of
          their own personal data.
        </p>
        <p className={PARAGRAPH_CLASS_NAMES}>
          Poketo strives to be a good internet citizen. The only data we save is
          what series you're following and when you last read them. We don't
          know who you are, and we don't want to! That's part of what makes
          Poketo fast, light, and fun.
        </p>
        <p className={PARAGRAPH_CLASS_NAMES}>(PS. Tools to export your data are in-progress! No more lock-in!)</p>
      </div>
      <div className={QUESTION_CLASS_NAMES}>
        <h2 className={HEADER_CLASS_NAMES} id="sites">
          A site I like isn't supported. How can I request it?
        </h2>
        <p className={PARAGRAPH_CLASS_NAMES}>
          Make an{' '}
          <a href="https://github.com/poketo/lib/issues/new">
            issue on the library repository
          </a>. We're slowly adding more sites, but would love to hear
          suggestions about which ones we add next.
        </p>
      </div>
      <div className={QUESTION_CLASS_NAMES}>
        <h2 className={HEADER_CLASS_NAMES} id="scanlators">
          How does reading on Poketo affect scanlators?
        </h2>
        <p className={PARAGRAPH_CLASS_NAMES}>
          Honestly, I'm not sure. I know a lot of work goes into translating
          series, and I don't want Poketo to take away from traffic, ad revenue
          or other ways scanlators support their work.
        </p>
        <p className={PARAGRAPH_CLASS_NAMES}>
          I'm open to figuring something out though. If you're a scanlator and
          have opinions about how Poketo can help, let me know!
        </p>
      </div>
      <div className={QUESTION_CLASS_NAMES}>
        <h2 className={HEADER_CLASS_NAMES} id="use-as-reader">
          Anything else?
        </h2>
        <p className={PARAGRAPH_CLASS_NAMES}>
          There's a few other sneaky ways to use Poketo. First, you can read
          series on <a href="https://github.com/poketo/lib">supported sites</a>{' '}
          by pasting their URLs into [insert link to page with search bar]. You
          can also use [insert link to bookmarklet] when you're on another site.
          You can also get an RSS feed for any series by appending{' '}
          <code>.rss</code> to the URL.
        </p>
      </div>
      <div className="pv-5 fs-12 ta-center">
        <Link to="/about" className="Link mr-3">
          About
        </Link>
        <a
          className="Link mr-3"
          href="https://github.com/poketo/site/issues/new">
          Send feedback
        </a>
        <a className="Link mr-3" href="https://github.com/poketo/site">
          Source
        </a>
      </div>
    </div>
  </div>
);
