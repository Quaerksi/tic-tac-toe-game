'use strict'

const $  = document.querySelector.bind(document);
const $$  = document.querySelectorAll.bind(document);

const FIELDS_IN_A_ROW = 3;



//create html elements
const htmlContent = () => {

  //creater table with ids
  makeQudraticTableWithIds(FIELDS_IN_A_ROW);

}

const playFunction = ev => {
  //console.log('In playFunction ' + event.target.id)
  socket.emit('move', event.target.id);
}

// make the quadratic matchfield
const makeQudraticTableWithIds = numberOfColSpan => {

  for(let i = 0; i < numberOfColSpan; i++){

    //create tr element
    var nodeTr = document.createElement("tr");
    //append tr element to table
    $('#matchfield').appendChild(nodeTr);

    for(let n = 0; n < numberOfColSpan; n++){

      //create td element
      var nodeTd = document.createElement("td");
      //add id to td element
      nodeTd.id = numberOfColSpan * i + n;
      //add event listener to td element
      (nodeTd).addEventListener('click', ev => playFunction(ev));

      //add textfield to td, to create a stable table
      var nodeP = document.createElement('p');
      //add id to p element
      nodeP.id =  numberOfColSpan * i + n;
      //add event listener to p element
      nodeP.addEventListener('click', ev => playFunction(ev));

      //add p element to td element
      nodeTd.appendChild(nodeP);
      //add td element to tr element
      $('#matchfield').children[i].appendChild(nodeTd);
    }
  };
}

htmlContent();



socket.on('setNumberOfUser', numberUser => {
  if(numberUser === 1){
    $('#status').innerHTML = 'Bitte warten Sie auf Ihren Gegner!';
  }
  if(numberUser === 2){
    $('#status').innerHTML = 'Zwei Spieler verbunden. Gleich geht es los';
  }
  if(numberUser > 2){
    $('#status').innerHTML = 'Sorry, es waren bereits genug Spieler online. Sie werden verbunden, wenn ein Platz frei wird';
  }
});

socket.on('sendMessage', message => {
  $('#info1').innerHTML = message;
});

socket.on('fillStatus', message => {
  $('#status').innerHTML = '' + message;
});

socket.on('notifyActivePlayer', activePlayer => {

      $('#info2').innerHTML = 'Am Zug ' + activePlayer + '.';

});

socket.on('deleteStatus', () => {
   $('#status').innerHTML = '';
});

socket.on('fillMatchfield', matchfield => {
  Array.from($$('#matchfield td p')).forEach((elem, i) => elem.innerHTML = matchfield[i]);
});

//const socket = io.connect();
setTimeout(function(){

  socket.emit('checkNumberOfUser');
}, 500);
