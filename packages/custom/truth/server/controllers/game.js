'use strict';

var GameInstance = require('../models/gameInstance');
var gameStates = require('../models/gameStates');

var gameInstances = [];

function getGameInstanceById(user, id) {
  var matchingGames = gameInstances.filter(function(gameInstance) {
    return gameInstance.id === id;
  });
  if(matchingGames.length !== 1) {
    return null;
  }
  return matchingGames[0];
}

function getActiveGamesByUser(user) {
  return gameInstances.filter(function(gameInstance) {
    return gameInstance.gameData.state !== gameStates.FINISHED && gameInstance.getPlayerById(user._id.toString()) !== null;
  });
}

module.exports = {
  getGameInstance: function(user, id, done) {
    var err = null;
    var gameInstance = getGameInstanceById(user, id);
    if(gameInstance === null) {
      err = new Error('Game(' + id + ') not found.');
    }
    done(err, gameInstance);
  },
  getActiveGamesByUser: function(user, done) {
    done(null, getActiveGamesByUser(user));
  },
  newGameInstance: function(gameDefinition, players, done) {
    var newGame = new GameInstance({gameDefinition: gameDefinition, players:players});
    gameInstances.push(newGame);
    done(null, newGame);
  }
};
