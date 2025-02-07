"use client";

import React, { ReactNode } from 'react';
import Head from 'next/head';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/theme';
import { MobileProvider } from '@/contexts/MobileContext';

type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = ({ children, title = 'This is the default title' }: Props) => (
  <MobileProvider>
    <ThemeProvider theme={theme}>
      <div>
        <Head>
          <title>{title}</title>
          <meta charSet="utf-8" />
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        {children}
      </div>
    </ThemeProvider>
  </MobileProvider>
);

export default Layout;