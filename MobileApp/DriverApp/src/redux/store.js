
import {applyMiddleware,
        combineReducers, 
        createStore}          from 'redux';
import {composeWithDevTools}  from 'redux-devtools-extension/developmentOnly';
import thunk                  from 'redux-thunk';
import {AppStateReducer}      from './AppState';
import userDetails            from './user';
import location               from './location';
import storeSettings                from './storeSettings';
const appReducer = combineReducers({
  userDetails,
  location,
  storeSettings,
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