'use strict';

let score = {
  matchfield: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  activePlayer: 'X',
  gameResult: ''
};

const ACTIVE_PLAYER = ['X', 'O'];
const GAME_RESULTS = ['X gewinnt', 'O gewinnt', 'unentschieden', 'Spiel noch nicht beendet' ]

let currentError = '';

exports.reset = () => {
  score.matchfield.forEach((elem, i, arr) => score.matchfield[i] = ' ' );
  score.activePlayer = ACTIVE_PLAYER[0];
  score.gameResult = '';
}

exports.matchfield = () => score.matchfield;

exports.getActivePlayer = () => score.activePlayer;

exports.getCurrentError = () => currentError;

exports.getGameResult = () => score.gameResult;

const toggleActivePLayer = () => score.activePlayer != 'O' ?   score.activePlayer = 'O' :   score.activePlayer = 'X';

exports.gameStart = () => score.gameResult = GAME_RESULTS[3];

exports.move = (player, field) => {
  currentError = ' ';

  if(score.gameResult === 'X gewinnt' || score.gameResult === 'O gewinnt') currentError = 'Das Spiel ist bereits zu Ende.';
    else if(player !== score.activePlayer) currentError = 'Der Zug wird vom nicht aktiven Spieler durchgeführt.';
    else if(score.matchfield[field] !== ' ') currentError = 'Das Zielfeld ist nicht frei.';
    else if(score.gameResult === 'Spiel noch nicht beendet' && player === score.activePlayer && score.matchfield[field] === ' ' ) {
      score.matchfield[field] = player;
      toggleActivePLayer();
    };
}
