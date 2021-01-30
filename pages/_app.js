import { node, object } from 'prop-types';

import { AppProvider } from '../src/app/providers/AppProvider';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <AppProvider>
      <Component {...pageProps} />
    </AppProvider>
  );
}

MyApp.propTypes = {
  Component: node,
  pageProps: object,
};

export default MyApp;
