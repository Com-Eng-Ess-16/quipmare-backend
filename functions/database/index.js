// const test = require("./test");
// const startGame = require("./startGame");
const stateListen = require("./stateListen");
const joinRoom = require("./joinRoom");

// exports.startGame = startGame.gameState;
exports.joinRoomPlayer = joinRoom.player;
exports.joinRoomSpectate = joinRoom.spectate;
exports.processTts = stateListen.processTts;
// exports.test = test.test;
// exports.test1 = test.test1;