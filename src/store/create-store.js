import { createStore as _createStore , applyMiddleware, compose } from 'redux'
import axios from 'axios'
import bindActionsToStore from './bind-actions-to-store'
import bs from '../utils/browser-storage'
import detectEnv from '../utils/detect-env'
import rootReducer from '../reducers'
import throttle from 'lodash/throttle'
import thunkMiddleware from 'redux-thunk'

const _ = {
  throttle,
}


/**
 * Create a redux store with custom setting
 *
 * @param {Object} [initialState={}]
 * @param {string} [cookie='']
 * @param {boolean} [isDev=false]
 * @returns
 */
export default async function createStore(initialState = {}, cookie = '', isDev = false) {
  const httpClientWithToken = cookie ? 
  // Take user cookie from the user's request coming to the server when doing SSR.
  axios.create({
    headers: { cookie }
  }) :
  // Take user cookie from the browser when making request on the client side directly
  axios.create({
    withCredentials: true
  })
  const composeEnhancers = (window && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose
  const storeEnhancer = composeEnhancers(
    applyMiddleware(
      thunkMiddleware.withExtraArgument({ httpClientWithToken }),
    ),
    bindActionsToStore
  )
  if (detectEnv.isBrowser()) {
    try {
      // sync redux state with browser storage
      const reduxState = await bs.syncReduxState(initialState)
      const store = _createStore(rootReducer, reduxState, storeEnhancer)
      if (isDev && module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('../reducers', () => {
          const nextRootReducer = require('../reducers').default
          store.replaceReducer(nextRootReducer)
        })
      }
      // Subscribe the redux store changes.
      // Sync the browser storage after redux state change.
      store.subscribe(_.throttle(() => {
        bs.syncReduxState(store.getState())
      }, 1000))
      return store
    } catch(err) {
      console.error('Sync-ing with browser storage occurs error:', err)
      return _createStore(rootReducer, initialState, storeEnhancer)
    }
  }
  return _createStore(rootReducer, initialState, storeEnhancer)
}
