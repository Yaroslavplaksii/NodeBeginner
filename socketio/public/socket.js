const status = document.getElementById('status');
const message = document.getElementById('message');
const form = document.getElementById('form');
const input = document.getElementById('input');

const socket = io('http://localhost:3000');

function setStatus(value){
    status.innerHTML = value;
}

function printMessage(value){
    const li = document.createElement('li');
    li.innerHTML = value;
    message.appendChild(li);
}

form.addEventListener('submit',event=>{
    event.preventDefault();
    socket.emit('chat',input.value);
    input.value = '';
});

socket.on('connect',()=> setStatus('ONLINE'));
socket.on('disconnect',()=> setStatus('DISCONNECTED'));
socket.on('chat',message => printMessage(message));
socket.on('ready',message => printMessage(message));
