import { ID, TOKEN, AUTH_INFO } from '../constants/local-storage-key'
import get from 'lodash/get'

const _ = {
  get,
}

const getVerifiedToken = () => {
  const browserLocalStorage = (typeof localStorage === 'undefined') ? null : localStorage
  if (browserLocalStorage) {
    const authInfoString = browserLocalStorage.getItem(AUTH_INFO)
    const authInfoObj = JSON.parse(authInfoString)
    return _.get(authInfoObj, TOKEN, '')
  }
  return null
}

const getUserId = () => {
  const browserLocalStorage = (typeof localStorage === 'undefined') ? null : localStorage
  if (browserLocalStorage) {
    const authInfoString = browserLocalStorage.getItem(AUTH_INFO)
    const authInfoObj = JSON.parse(authInfoString)
    return _.get(authInfoObj, ID, '')
  }
  return null
}

export const getNecessaryInfo = () => {
  return {
    token: getVerifiedToken(),
    userId: getUserId(),
  }
}
