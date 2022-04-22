"use strict";

const IP = "127.0.0.1";
const PORT = 8081;

const express = require("express");
const app = express();
app.use(express.static("public"));

const http = require("http");
const socketIo = require("socket.io");
const webServer = http.Server(app);
const io = socketIo(webServer);

const gameModule = require('./GameModule');

let usersOnline = [];
const NEEDED_PLAYERS = 2;
const ACTIVE_PLAYER = ['X', 'O'];


const gameStart = socket => {
  //console.log('game Start vor: ' + gameModule.getGameResult());
    setTimeout(function(){
      io.emit('notifyActivePlayer',  gameModule.getActivePlayer());
      io.emit('deleteStatus');
    }, 2000);
    gameModule.gameStart();
    //setTimeout(function(){console.log('game Start nach: ' + gameModule.getGameResult());}, 2000);

}


io.on('connection', socket => {


  //usersNumber +=1;
  usersOnline.push(socket);

  console.log('Start: user online ' + usersOnline.length);

  // status if there are less, enough or to much player
  if(usersOnline[0] === socket || usersOnline[1] === socket) {
    usersOnline[0].emit('setNumberOfUser', usersOnline.length);
    if( usersOnline[1]) {usersOnline[1].emit('setNumberOfUser', usersOnline.length); }
  } else {
    socket.emit('setNumberOfUser', usersOnline.length);
  }

console.log('warte auf Programmabbarbeitung');
  //send Player information and start game
  socket.on('checkNumberOfUser', () => {
      console.log('Starte Programmabbarbeitung');
    if(usersOnline.length <= NEEDED_PLAYERS){

      if(usersOnline.length < NEEDED_PLAYERS) {
        socket.emit('sendMessage', 'Sie spielen als X.');
      }
      if(usersOnline.length === NEEDED_PLAYERS) {
        socket.emit('sendMessage', 'Sie spielen als O.');
        gameStart(socket);
      }
    }
  });

  //Muss noch vor klicks vor der initialisierung bewahrt werden
  socket.on('move', fieldId => {

    if(gameModule.getGameResult() === 'Spiel noch nicht beendet'){
      //will ich das folgende?
      usersOnline[0].emit('deleteStatus');
      usersOnline[1].emit('deleteStatus');

      gameModule.move(ACTIVE_PLAYER[usersOnline.indexOf(socket)], fieldId);
      io.emit('fillMatchfield', gameModule.matchfield());
      io.emit('notifyActivePlayer',  gameModule.getActivePlayer());
      if (socket === usersOnline[0] || socket === usersOnline[1]) socket.emit('fillStatus',  gameModule.getCurrentError());
    }

  });

  socket.on('disconnect', () => {

    //setTimeout(function(){console.log('game Start nach: ' + gameModule.getGameResult());}, 2000);
    //let i = 0;


    if((usersOnline[0] === socket || usersOnline[1] === socket) &&  usersOnline.length >= 2){

      if(usersOnline[0] === socket) usersOnline[1].emit('sendMessage', 'Ein Spieler hat das Spiel verlassen. Sie werden mit dem nächsten Spieler verbunden');
      if(usersOnline[1] === socket) usersOnline[0].emit('sendMessage', 'Ein Spieler hat das Spiel verlassen. Sie werden mit dem nächsten Spieler verbunden');

      //setTimeout(function(){
      setTimeout(function(){
      //Spiel ist beendet
      gameModule.reset();

      /*******************checke die verbliebenen Sockets neu ein*******************************************/
      	usersOnline = usersOnline.filter(user => user != socket);
        let userNew = usersOnline;
        usersOnline = [];
        console.log('Users still online:' + userNew.length)
        setTimeout(function(){ userNew.forEach(sock => sock.emit('relode')); }, 100);
      /*******************************************************************************************************/
      //Spieler drei kann ein neues Spiel mit dem verbleibenden Spieler anfangen
}, 2000);
      //i++;
  //  }, 2000);
      //console.log('In if ' + i + ' ' + socket.id);
    } else {
    //  i++;
      //console.log('In else ' + i + ' ' + socket.id);
      //io.emit('relode');
      //usersNumber -= 1;
      usersOnline = usersOnline.filter(user => user != socket);
    }

    console.log('Ende: user online: ' +   usersOnline.length + ' ' + socket.id + 'userNumber: ' + usersOnline.length);
  });
});


webServer.listen(PORT, IP, () => {
    console.log(`Server running at http://${IP}:${PORT}/`);
});
