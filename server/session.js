const Cookies = require('cookies')

const env = process.env.NODE_ENV || 'development'

// Optionally define keys to sign cookie values
// to prevent client tampering
const SUPERSECURE_KEYS = [
  'this should be changed for any real use in production'
]

let secure = true
if (env === 'development') {
  secure = false
  console.warn('DEVELOPMENT MODE: cookies are not being made secure')
}

module.exports = {
  getState(req, name) {
    // Create a cookies object
    const cookies = new Cookies(req, null, { keys: SUPERSECURE_KEYS, secure })
    // Get a cookie
    return cookies.get(name, { signed: true })
  },
  setState(res, name, value) {
    // Create a cookies object
    const cookies = new Cookies(null, res, { keys: SUPERSECURE_KEYS, secure })

    // Set the cookie to a value
    cookies.set(name, value, { signed: true })
  }
}
