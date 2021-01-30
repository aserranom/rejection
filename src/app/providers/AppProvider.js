import { node } from 'prop-types';
import React, { useEffect, useReducer } from 'react';
import { useContext } from 'react';

import {
  localStorageToState,
  reducer,
  stateToLocalStorage,
} from '../../questions/reducer/reducer';

const AppContext = React.createContext({});

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, [], localStorageToState);
  useEffect(() => {
    stateToLocalStorage(state);
  }, [state]);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

AppProvider.propTypes = {
  children: node,
};

export const useAppState = () => useContext(AppContext);
