// @flow

import React from 'react';
import Head from 'react-helmet';
import { Link } from 'react-router-dom';

import HomeLayout from '../components/home-layout';

export default () => (
  <HomeLayout>
    <Head>
      <title>Not found</title>
    </Head>
    <div className="pa-3 x xd-column xa-center xj-center mh-100vh">
      <div className="mb-4">
        <svg
          height="64"
          viewBox="0 0 32 32"
          width="64"
          xmlns="http://www.w3.org/2000/svg">
          <g
            fill="none"
            fillRule="evenodd"
            strokeLinecap="round"
            strokeLinejoin="round"
            stroke="currentColor"
            strokeWidth="2">
            <path d="m10 24h12" />
            <g>
              <g transform="translate(22 9)">
                <path d="m0 0 6.36396103 6.36396103" />
                <path
                  d="m0 0 6.36396103 6.36396103"
                  transform="matrix(-1 0 0 1 6.363962 0)"
                />
              </g>
              <g transform="translate(4 9)">
                <path d="m0 0 6.36396103 6.36396103" />
                <path
                  d="m0 0 6.36396103 6.36396103"
                  transform="matrix(-1 0 0 1 6.363962 0)"
                />
              </g>
            </g>
          </g>
        </svg>
      </div>
      <h3 className="fw-semibold mb-3">Page not found</h3>
      <p>
        If you want you can{' '}
        <Link className="Link" to="/">
          head back home
        </Link>
        .
      </p>
    </div>
  </HomeLayout>
);
