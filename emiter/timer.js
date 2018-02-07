const eventEmiter = require('./PersonalEmiter');
class Timer extends eventEmiter{
    constructor(total){
        super(); //якщо наслідується, то потрібно отримати доступ до this через цей метод
        this.total = total;
        this.ticks = 0;
    }
    start(){
        this.interval = setInterval(()=>this.tick(),1000);
        this.emit('start');
    }
    tick(){
        this.ticks +=1;
        if(this.ticks <= this.total){
            this.emit('tick',this.ticks);
        }else{
            this.stop();
        }
    }
    stop(){
        clearInterval(this.interval);
        this.emit('end');
    }
}
const timer = new Timer(10);
timer.on('start',()=>console.log('Start'));
timer.on('tick',tick=>console.log(tick));
timer.on('end',()=>console.log('End'));
timer.start();