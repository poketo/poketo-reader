// @flow

import React from 'react';

import Footer from '../components/footer';

export default () => (
  <div>
    <div className="mw-900 mh-auto pv-4 ph-3 ph-0-m">
      <div className="mb-3">
        <h2 id="sites">A site I like isn't supported. How can I request it?</h2>
        <p className="mb-2">
          Make an{' '}
          <a href="https://github.com/poketo/lib/issues/new">
            issue on the library repository
          </a>. We're slowly adding more sites, but would love to hear
          suggestions about which ones we add next.
        </p>
      </div>
      <div className="mb-3">
        <h2 id="scanlators">How does reading on Poketo affect scanlators?</h2>
        <p className="mb-2">
          Honestly, I'm not sure. I know a lot of work goes into translating
          series, and I don't want Poketo to take away from traffic or ad
          revenue or other things scanlators use to motivate their work.
        </p>
        <p>
          I'm open to figuring something out though. If you're a scanlator and
          have opinions about how Poketo can help, let me know!
        </p>
      </div>
      <div className="mb-3">
        <h2 id="accounts">How do I sign up? Where are the accounts?</h2>
        <p className="mb-2">
          There are no accounts! Over the past few years, the web has become a
          weird corporate place, with everybody asking for your email. It's a
          small piece of the larger problem of people not being in control of
          their own personal data.
        </p>
        <p className="mb-2">
          Poketo strives to be a good internet citizen. The only data we save is
          what series you're following and when you last read them. We don't
          know who you are, and we don't want to! That's part of what makes
          Poketo fast, light, and fun.
        </p>
        <p>(PS. Tools to export your data are in-progress! No more lock-in!)</p>
      </div>
      <div className="mb-3">
        <h2 id="use-as-reader">What if I don't want to track series?</h2>
        <p className="mb-2">
          There's a few other sneaky ways to use Poketo. First, you can read
          series on{' '}
          <a
            href="https://github.com/poketo/lib"
            target="_blank"
            rel="noopener noreferrer">
            supported sites
          </a>{' '}
          by pasting their URLs into [insert link to page with search bar]. You
          can also use [insert link to bookmarklet] when you're on another site.
        </p>
      </div>
    </div>
    <Footer />
  </div>
);
