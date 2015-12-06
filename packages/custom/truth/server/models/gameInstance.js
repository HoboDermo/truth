var utilities = require('../helpers/utilities');
var GameData = require('./gameData');
var gameStates = require('./gameStates');

/*
 Represents game instance
 */
function GameInstance(base) {
  this.id = base.id || utilities.guid();
  this.gameDefinition = base.gameDefinition;
  this.gameData = base.gameData || new GameData(base.players);

  //check if base.game is object instance
  //if not initialise with base data
  this.game = base.game || new this.gameDefinition.Game(this.gameData); //TODO: new Game Instance

  if(this.gameData.state === gameStates.SETUP) {
    goToNextState.call(this);
  }
}

GameInstance.prototype.getPlayerById = function(id) {
  var matchingPlayers = this.gameData.players.filter(function(player) {
    return player.playerData._id === id;
  });
  if(matchingPlayers.length != 1) {
    return null;
  }
  return matchingPlayers[0];
};

GameInstance.prototype.sanitize = function(userId) {
  return {
    id: this.id,
    gameDefinition: this.gameDefinition.sanitize(),
    gameData: this.gameData.sanitize(userId),
    game: this.game.sanitize(userId)
  };
};

GameInstance.prototype.getGameUpdate = function(userId, data) {
  return this.game.getUpdate(this.gameData, userId, data, goToNextState.bind(this));
};

GameInstance.prototype.sendDataToGame = function(userId, data) {
  return this.game.sendData(this.gameData, userId, data, goToNextState.bind(this));
};

function goToNextState() {
  //console.log("OLD STATE: " + this.gameData.state);
  if(isEndOfGame.call(this)) {
    this.gameData.state = gameStates.FINISHED;
  } else {
    switch(this.gameData.state) {
      case gameStates.SETUP:
        this.gameData.state = gameStates.DEAL;
        deal.call(this);
        break;
      case gameStates.DEAL:
        this.gameData.state = gameStates.PLAYER_ACTION;
        playerAction.call(this);
        break;
      case gameStates.PLAYER_ACTION:
        if(isEndOfHand.call(this)) {
          this.gameData.state = gameStates.END_OF_HAND;
          endOfHand.call(this);
        } else {
          this.gameData.state = gameStates.GET_NEXT_PLAYER;
          getNextPlayer.call(this);
        }
        break;
      case gameStates.END_OF_HAND:
        if(isEndOfMatch.call(this)) {
          this.gameData.state = gameStates.DEAL;
          deal.call(this);
        } else {
          this.gameData.state = gameStates.PLAYER_ACTION;
          playerAction.call(this);
        }
        break;
      case gameStates.GET_NEXT_PLAYER:
        this.gameData.state = gameStates.PLAYER_ACTION;
        playerAction.call(this);
        break;
      case gameStates.FINISHED:
        //TODO: Archive game
        break;
      default:
      //TODO: Error handling
    }
  }
}

function deal() {
  //console.log("DEAL");
  if(utilities.isNotFunction(this.game.deal)) {
    goToNextState.call(this);
  } else {
    this.game.deal(this.gameData, goToNextState.bind(this));
  }
}

function playerAction() {
  //console.log("PLAYER_ACTION");
  if(utilities.isNotFunction(this.game.playerAction)) {
    goToNextState.call(this);
  } else {
    this.game.playerAction(this.gameData, goToNextState.bind(this));
  }
}

function isEndOfHand() {
  //console.log("IS_END_OF_HAND");
  return this.game.isEndOfHand(this.gameData);
}

function endOfHand() {
  //console.log("END_OF_HAND");
  if(utilities.isNotFunction(this.game.endOfHand)) {
    goToNextState.call(this);
  } else {
    this.game.endOfHand(this.gameData, goToNextState.bind(this));
  }
}

function isEndOfMatch() {
  //console.log("IS_END_OF_MATCH");
  return this.game.isEndOfMatch(this.gameData);
}

function isEndOfGame() {
  //console.log("IS_END_OF_GAME");
  return this.game.isEndOfGame(this.gameData);
}

function getNextPlayer() {
  //console.log("GET_NEXT_PLAYER");
  if(utilities.isNotFunction(this.game.getNextPlayer)) {
    this.gameData.currentPlayerIndex++;
    if(this.gameData.currentPlayerIndex >= this.gameData.players.length) {
      this.gameData.currentPlayerIndex = 0;
    }
    goToNextState.call(this);
  } else {
    this.game.getNextPlayer(this.gameData, goToNextState.bind(this));
  }
}

module.exports = GameInstance;
