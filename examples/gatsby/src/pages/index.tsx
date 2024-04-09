/* eslint-disable import/no-default-export */
import { LiFiWidget } from '@lifi/widget';
import type { HeadFC } from 'gatsby';
import * as React from 'react';

const IndexPage = () => {
  return (
    <LiFiWidget
      config={{
        theme: {
          container: {
            boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)',
            borderRadius: '16px',
          },
        },
      }}
      integrator="gatsby-example"
    />
  );
};

export default IndexPage;

export const Head: HeadFC = () => <title>Home Page</title>;
