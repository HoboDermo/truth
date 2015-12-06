var Lobby = require('../models/lobby');
var GameController = require('./game');
var GameDefinitionsController = require('./gameDefinitions');

var lobbies = [];

function getLobbyByGameDefinitionId(id) {
  var matchingLobbies = lobbies.filter(function(lobby) {
    return lobby.gameDefinition.id == id;
  });
  if(matchingLobbies.length != 1) {
    return null;
  }
  return matchingLobbies[0];
}

function removeLobby(lobbyToRemove) {
  //console.log("Removing lobby " + lobbyToRemove.gameDefinition.id);
  var gameDefinitionId = lobbyToRemove.gameDefinition.id;
  lobbies = lobbies.filter(function(lobby) {
    return lobby.gameDefinition.id !== gameDefinitionId;
  });
}

module.exports = function() {
  return {
    join: function (user, gameId, done) {
      var lobby = getLobbyByGameDefinitionId(gameId);
      if (!lobby) {
        GameDefinitionsController.getById(gameId, function(err, gameDefinition) {
          var newLobby = new Lobby({
            gameDefinition: gameDefinition
          });
          lobbies.push(newLobby);
          newLobby.addPlayer(user);
          done(null, newLobby);
        });
      } else {
        lobby.addPlayer(user);
        var changes = lobby.checkStatusForUser(user._id);

        if(changes.closedChange && lobby.isClosed) {
          var players = lobby.players.map(function(player) {
            return player.playerData;
          });
          GameController.newGameInstance(lobby.gameDefinition, players,
            function(err, newGame) {
              lobby.gameInstanceId = newGame.id;
              lobby.status = "READY";
              done(null, lobby);
            }
          );
        } else {
          done(null, lobby);
        }
      }
    },
    confirmRecievedGameInstanceState: function (user, gameId, done) {
      var lobby = getLobbyByGameDefinitionId(gameId);
      if (!lobby) {
        done(new Error("Lobby not found"));
      } else {
        lobby.updatePlayerGameInstanceIdFlag(user._id);
        lobby.checkStatus();
        if (lobby.canRemove) {
          removeLobby(lobby);
        }
        done(null, true);
      }
    }
  }
};
