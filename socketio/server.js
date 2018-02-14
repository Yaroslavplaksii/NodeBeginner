const WebSocket = require('ws');
const server = new WebSocket.Server({port:3000});

server.on('connection',ws=>{
    ws.on('mesasge',message=>{
        if(message === 'exit'){
            ws.close();
        }else{
            server.client.forEach(client=>{
                if(client.readyState == Websocket.OPEN){
                    client.send(message);
                }
            });
        }

    });
    ws.send('Wellcome!!!!');
});