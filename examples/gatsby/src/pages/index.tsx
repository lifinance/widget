/* eslint-disable import/no-default-export */
import { LiFiWidget } from '@lifi/widget';
import type { HeadFC } from 'gatsby';
import * as React from 'react';

const IndexPage = () => {
  return (
    <LiFiWidget
      config={{
        containerStyle: {
          border: '1px solid rgb(234, 234, 234)',
          borderRadius: '16px',
        },
      }}
      integrator="gatsby-example"
    />
  );
};

export default IndexPage;

export const Head: HeadFC = () => <title>Home Page</title>;
