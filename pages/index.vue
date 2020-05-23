<template>
  <div class="container">
    <h1 class="title">nuxt-socketio</h1>
    <h2 class="subtitle">
      An example of integrating socket.io in a NuxtJS app
    </h2>
    <div id="chat-message-container" class="chat-message-container">
      <div v-for="(msg, idx) in messages" :key="idx" class="chat-message">
        <span class="who">{{ msg.who }}</span>
        <span class="content">{{ msg.message }} </span>
      </div>
    </div>
    <div class="chat-controls-container">
      <input
        v-model="inputMsg"
        class="chat-input"
        type="text"
        @keyup.enter="sendMessage"
      />
      <button class="chat-btn" @click="sendMessage">Send</button>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
function scrollChat() {
  const chatWindow = document.getElementById('chat-message-container')
  chatWindow.scrollTop = chatWindow.scrollHeight
}
export default {
  asyncData() {
    return {
      inputMsg: '',
      messages: []
    }
  },
  computed: {
    chatContent() {
      return this.messages.join('\n')
    }
  },
  mounted() {
    this.$socket.on('connect', () => {
      this.messages.push('connected to room')
    })

    this.$socket.on('message', (msg) => {
      this.messages.push({ who: 'SOMEONE', message: msg })
      scrollChat()
    })
  },
  methods: {
    sendMessage() {
      this.messages.push({ who: 'YOU', message: this.inputMsg })
      this.$socket.emit('message', this.inputMsg)
      this.inputMsg = ''

      // TODO: See if this is an okay practice. Seems to work though!
      // Autoscroll to bottom
      Vue.nextTick(function() {
        scrollChat()
      })
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
.container {
  margin: 0 auto;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.chat-message-container {
  flex-grow: 1;
  overflow-y: auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: left;
  text-align: left;
}
.chat-message {
  margin: 4px 0;
}
.chat-message .who {
  width: 100px;
  display: inline-block;
  font-weight: 700;
  color: #35495e;
  text-align: right;
  margin-right: 8px;
}
.chat-btn {
  font-weight: 300;
  font-size: 24px;
  padding: 8px;
}
.chat-controls-container {
  width: 100%;
  display: flex;
  flex-direction: row;
}
.chat-input {
  flex-grow: 1;
  height: 30px;
  font-weight: 300;
  font-size: 24px;
  padding: 8px;
  color: #526488;
}
</style>
