const socket = io('http://localhost:3000')
const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')

function encrypt(message = '', key = ''){//funcion para encriptar el mensaje
  var message = CryptoJS.AES.encrypt(message, key);// llama a la funcion encrypt de la libreria CryptoJS dentro de el algoritmo AES y le pasa el mensaje y la contraseña
  return message.toString();//regresa el mensaje encriptado
}
function decrypt(message = '', key = ''){// funcion para desencriptar el mensaje
  var code = CryptoJS.AES.decrypt(message, key); // llama a la funcion decrypt de la libreria CryptoJS dentro de el algoritmo AES y le pasa el mensaje y la contraseña
  var decryptedMessage = code.toString(CryptoJS.enc.Utf8); //le da la codificacion utf8 a el mensaje desencriptado

  return decryptedMessage;//regresa el mensaje
}

const name = prompt('cual es tu nombre?')
const key = prompt('cual es la contraseña?')
appendMessage('Te has unido')
socket.emit('new-user', name)


socket.on('chat-message', data => {
  data.message = decrypt(data.message, key) //desencrypta el mensaje
  appendMessage(`${data.name}: ${data.message}`)
})

socket.on('user-connected', name => {
  appendMessage(`${name} se ha conectado`)
})

socket.on('user-disconnected', name => {
  appendMessage(`${name} se ha desconectado`)
})

messageForm.addEventListener('submit', e => {
  e.preventDefault()
  messageInput.value = encrypt(messageInput.value, key); //encriptar el mensaje
  const message = messageInput.value
  appendMessage(`Tu: ${message}`)
  socket.emit('send-chat-message', message)
  messageInput.value = ''
})

function appendMessage(message) {
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  messageContainer.append(messageElement)
}