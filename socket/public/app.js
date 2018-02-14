const status = document.getElementById('status');
const message = document.getElenmentById('message');
const form = document.getElementById('form');
const input = document.getElenmentById('input');

const ws = new WebSocket('ws://localhost:3000');

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
    ws.send(input.value);
    input.value = '';
});

ws.onopen = ()=>setStatus('ONLINE');
ws.onclose = ()=>setStatus('DISCONNECTED');
ws.onmessage = response => printMessage(response.date);