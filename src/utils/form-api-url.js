import config from '../conf/api-config.json'

const formAPIURL = (path) => {
  let host
  let port
  if (process.env.NODE_ENV === 'development') {
    return `http://localhost:8080/v1/${encodeURI(path)}`
  }

  // process.env.BROWSER is defined in next.config.js
  if (process.env.BROWSER) {
    host = config.API_HOST_ON_CLIENT
    port = config.API_PORT_ON_CLIENT
  } else {
    host = config.API_HOST_ON_SERVER
    port = config.API_PORT_ON_SERVER
  }

  return `${config.API_PROTOCOL}://${host}:${port}/v1/${encodeURI(path)}`
}

export default formAPIURL
