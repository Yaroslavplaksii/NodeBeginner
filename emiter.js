const EventEmiter = require('events');
const emiter = new EventEmiter();

// emiter.on('start',()=>console.log('start'));
// emiter.emit('start');

// emiter.on('start',message=>console.log(message));
// emiter.emit('start','tetsing start');

emiter.once('start',message=>console.log(message));
emiter.emit('start','tetsing start');
emiter.removeAllListeners();
emiter.emit('start','tetsing start');
emiter.emit('start','tetsing start');
emiter.emit('start','tetsing start');