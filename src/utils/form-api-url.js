import config from '../conf/api-config.json'

const formAPIURL = (path, toEncode = true) => {
  let protocol
  let host
  let port
  let version
  const _path = toEncode ? encodeURI(path) : path
  if (process.env.NODE_ENV === 'development') {
    protocol = process.env.API_PROTOCOL || 'http'
    host = process.env.API_HOST || 'localhost'
    port = process.env.API_PORT || '8080'
    version = process.env.API_DEFAULT_VERSION || '/v1/'
  } else {
    protocol = process.env.API_PROTOCOL || config.API_PROTOCOL
    host = process.env.API_HOST || config.API_HOST
    port = process.env.API_PORT || config.API_PORT
    version = process.env.API_DEFAULT_VERSION || config.API_DEFAULT_VERSION
  }

  return `${protocol}://${host}:${port}${version}${_path}`
}

export default formAPIURL
