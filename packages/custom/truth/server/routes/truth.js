'use strict';
var LobbyController = require('../controllers/lobby')();
var GameController = require('../controllers/game');
var GameDefinitionsController = require('../controllers/gameDefinitions');

/* jshint -W098 */
// The Package is past automatically as first parameter
module.exports = function(Truth, app, io, auth, database) {

  Truth.getSocketGameInstance = function(socketIo) {
    socketIo.use(function(data, accept) {
      var gameInstanceId = data.request._query.id;
      GameController.getGameInstance(data.user, gameInstanceId, function(err, gameInstance) {
        data.gameInstance = gameInstance;
        accept(err);
      });
    });
  };

  app.param('gameInstanceId', function(req, res, next, gameInstanceId) {
    GameController.getGameInstance(req.user, gameInstanceId, function(err, gameInstance) {
      req.gameInstance = gameInstance;
      next();
    });
  });

  app.get('/api/truth/dashboard', auth.requiresLogin, function(req, res, next) {
    GameController.getActiveGamesByUser(req.user, function(err, games) {
      GameDefinitionsController.getAll(function(err, gameDefinitions) {
        var mockDashboard = {
          activeGames: games,
          gameDefinitions: gameDefinitions
        };

        res.json(mockDashboard);
      });
    });
  });

  var lobbyIo = io.getSocket('/lobby');
  io.socketAuth(lobbyIo);

  lobbyIo.use(function(data, accept) {
    var id = data.request._query.id;
    LobbyController.join(data.user, id, function(err, lobby) {
      data.lobby = lobby;
      accept();
    });
  });

  lobbyIo.on('connection', function(socket) {
    
    var lobby = socket.lobby;

    socket.on('confirmGameInstanceId', function (data) {
      LobbyController.confirmRecievedGameInstanceState(socket.user, lobby.gameDefinition.id, function() {});
    });

    function sendLobbyUpdate() {
      socket.emit('lobbyUpdate', {
        lobby: lobby.sanitize(socket.user._id)
      });
    }
    socket.on('checkIn', function (data) {
      LobbyController.join(socket.user, lobby.gameDefinition.id, function(err, lobby) {
        sendLobbyUpdate();
      });
    });

    sendLobbyUpdate();

    lobby.getUpdate(socket.user._id, {
      callback: sendLobbyUpdate
    });

  });

  Truth.registerGameDefinition = GameDefinitionsController.registerGameDefinition;

};
