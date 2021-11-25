import { createStore, applyMiddleware, compose } from 'redux';

import thunk from 'redux-thunk';
import mwPender from 'redux-pender'; // 비동기를 위한 라이브러리
import logger from 'redux-logger';

import rootReducer from './connectors.redux';

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
}

// 개발 모드일 때만 Redux Devtools 적용
const isDev = process.env.NODE_ENV === 'development';
const devtools = isDev && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
const composeEnhancers = devtools || compose;

const Store = createStore(
    rootReducer,
    composeEnhancers(
        applyMiddleware(
            thunk,
            mwPender(),
            // logger,
            // MWs.authentication
            // ...add middleware
        ),
    ),
);
export default Store;
