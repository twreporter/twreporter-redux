import { ID, TOKEN } from '../constants/local-storage-key'

const getVerifiedToken = () => {
  const browserLocalStorage = (typeof localStorage === 'undefined') ? null : localStorage
  if (browserLocalStorage) {
    return browserLocalStorage.getItem(TOKEN)
  }
  return null
}

const getUserId = () => {
  const browserLocalStorage = (typeof localStorage === 'undefined') ? null : localStorage
  if (browserLocalStorage) {
    return browserLocalStorage.getItem(ID)
  }
  return null
}

export const getNecessaryInfo = () => {
  return {
    token: getVerifiedToken(),
    userId: getUserId(),
  }
}
