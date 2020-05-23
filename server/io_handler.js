module.exports = function handler(io) {
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
