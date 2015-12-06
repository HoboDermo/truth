'use strict';

/* jshint -W098 */
// The Package is past automatically as first parameter
module.exports = function(TwentyFive, app, io, auth, database, truth) {

  var twentyFiveIo = io.getSocket('/twentyFive');

  io.socketAuth(twentyFiveIo);

  truth.getSocketGameInstance(twentyFiveIo);

  twentyFiveIo.use(function(socket, accept) {
    var err = null;
    if(socket.gameInstance === null || socket.gameInstance.gameDefinition.id !== 'twentyFive') {
      err = new Error('Invalid game instance.')
    }
    accept(err);
  });

  twentyFiveIo.on('connection', function(socket) {
    
    var gameInstance = socket.gameInstance;

    socket.on('selectCard', function (data) {
      gameInstance.sendDataToGame(socket.user._id, data);
    });

    var sendGameUpdate = function() {
      socket.emit('gameInstanceUpdate', {
        gameInstance: gameInstance.sanitize(socket.user._id)
      });
    }

    sendGameUpdate();

    gameInstance.getGameUpdate(socket.user._id, {
      callback: sendGameUpdate
    });

  });

};
