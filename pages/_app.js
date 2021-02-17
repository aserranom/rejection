import { node, object } from 'prop-types';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { localStorageToState, reducer } from '../src/questions/reducer/reducer';

import '../styles/globals.css';

const store = createStore(reducer, localStorageToState());
function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

MyApp.propTypes = {
  Component: node,
  pageProps: object,
};

export default MyApp;
