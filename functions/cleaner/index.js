const deleteRoom = require("./deleteRoom");
const deleteGame = require("./deleteGame");

module.exports = async context => {
    await deleteRoom();
    await deleteGame();
    return null;
}