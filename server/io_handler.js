const session = require('./session')

module.exports = function handler(io) {
  io.set('authorization', function(req, accept) {
    const UID = session.getState(req, 'UID')
    if (UID) {
      console.log('socket is from user', UID)
    } else {
      // if there isn't, turn down the connection with a message
      // and leave the function.
      console.log('No Cookie was sent')
      return accept('No cookie transmitted.', false)
    }
    // accept the incoming connection
    accept(null, true)
  })

  console.log('registering socket.io handler...')
  io.on('connection', (socket) => {
    console.log('connection made')

    socket.on('message', (msg) => {
      console.log('received message', msg)
      socket.broadcast.emit('message', msg)
    })

    socket.on('disconnect', () => {
      console.log('connection disconnected')
    })
  })
  console.log('socket.io handler registered')
}
