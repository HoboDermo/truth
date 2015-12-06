var gameStates = require('./gameStates');

function GameData(players) {
  this.players = players.map(function(player) {
    return {
      playerData: player
    };
  });
  this.state = gameStates.SETUP;

  //TODO: Change to reference to player object?
  this.currentPlayerIndex = 0;
}

GameData.prototype.sanitize = function(userId) {
  return {
    state: this.state,
    players: this.players.map(function(player) {
      return {
        playerData: player.playerData //TODO: Hide player info
      };
    }),
    currentPlayerIndex: this.currentPlayerIndex
  };
};

module.exports = GameData;
