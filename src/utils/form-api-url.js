import config from '../conf/api-config.json'

const formAPIURL = (path, toEncode = true) => {
  let protocol
  let host
  let port
  const _path = toEncode ? encodeURI(path) : path
  if (process.env.NODE_ENV === 'development') {
    return `http://localhost:8080/v1/${_path}`
  }

  // process.env.BROWSER is defined in next.config.js
  if (process.env.BROWSER) {
    protocol = config.API_PROTOCOL_ON_CLIENT
    host = config.API_HOST_ON_CLIENT
    port = config.API_PORT_ON_CLIENT
  } else {
    protocol = config.API_PROTOCOL_ON_SERVER
    host = config.API_HOST_ON_SERVER
    port = config.API_PORT_ON_SERVER
  }

  return `${protocol}://${host}:${port}/v1/${_path}`
}

export default formAPIURL
