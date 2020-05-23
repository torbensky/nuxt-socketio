import io from 'socket.io-client'

console.log('initializing socket.io client...')
export default ({ _ }, inject) => {
  inject('socket', io())
}
console.log('socket.io client initialized!')
