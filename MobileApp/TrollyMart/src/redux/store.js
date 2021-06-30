
import {applyMiddleware,
        combineReducers, 
        createStore}          from 'redux';
import {composeWithDevTools}  from 'redux-devtools-extension/developmentOnly';
import thunk                  from 'redux-thunk';
import {AppStateReducer}      from './AppState';
import userDetails            from './user';
import productList            from './productList';
import wishDetails            from './wishDetails';
import globalSearch           from './globalSearch';
import location               from './location';
import section                from './section';
import storeSettings                from './storeSettings';
import s3Details              from './s3Details';
const appReducer = combineReducers({
  userDetails,
  productList,
  wishDetails,
  globalSearch,
  location,
  section,
  storeSettings,
  s3Details,
  appStateReducer: AppStateReducer,
});

export const USER_LOGOUT = 'USER_LOGOUT';

const rootReducer = (state, action) => {
  if (action.type === USER_LOGOUT) {
    state = undefined;
  }

  return appReducer(state, action);
};

export default createStore(
  rootReducer,
  {},
  composeWithDevTools(applyMiddleware(thunk)),
);