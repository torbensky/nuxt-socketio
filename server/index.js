const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()
// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
const session = require('./session')

app.use((req, res, next) => {
  const lastVisit = session.getState(req, 'LastVisit')
  console.log('last visit was', lastVisit)

  // Set the cookie to a value
  session.setState(res, 'LastVisit', new Date().toISOString())
  console.log('last visit was', lastVisit)

  const UID = session.getState(req, 'UID')
  if (!UID) {
    const UID = Math.round(Math.random() * 100000000)
    console.log('created UID for session', UID)
    // WARNING: don't actually use this approach for creating UID's
    // This is just for demonstration purposes.
    session.setState(res, 'UID', UID)
  } else {
    console.log('request from user with existing sesssion', UID)
  }

  next()
})

app.post('/login', function(req, res, next) {
  console.log('Request Type:', req.method)
  res.send('HELLO')
})

config.dev = process.env.NODE_ENV !== 'production'

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  await nuxt.ready()
  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  const server = app.listen(port, host)

  // Start socket.io
  const io = require('socket.io')(server)
  require('./io_handler')(io)

  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
