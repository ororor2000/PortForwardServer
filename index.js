const WebSocket = require("ws");
const express = require("express");
const app = express()
const path = require("path")

app.use("/",express.static(path.resolve(__dirname, "../client")))

const myServer = app.listen(8080)       // regular http server using node express which serves your webpage

const wsServer = new WebSocket.Server({
    noServer: true
})                                      // a websocket server

wsServer.on("connection", (ws) => {   
    console.log("got connection") 
    ws.on("message", (msg) => {        // what to do on message event
        wsServer.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {     
              console.log(msg.toString())                
              client.send(msg.toString());
            }
        })
    })
})

wsServer.on("close", () => {
    console.log("closed connection")
})

myServer.on('upgrade', async function upgrade(request, socket, head) {      //handling upgrade(http to websocekt) event
    //emit connection when request accepted
    wsServer.handleUpgrade(request, socket, head, function done(ws) {
      wsServer.emit('connection', ws, request);
    });
});
