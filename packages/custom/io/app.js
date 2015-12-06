'use strict';

/*
 * Defining the Package
 */

var config = require('meanio').loadConfig();
var socketio = require('socket.io');
var socketioJwt = require('socketio-jwt');

var Module = require('meanio').Module;

var Io = new Module('io');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Io.register(function(app, http, auth, database) {

  var sockets = null;

  Io.getSocket = function(namespace) {
    if(!sockets) {
      sockets = socketio.listen(http);
    }
    if(!namespace) {
      return sockets;
    }
    return sockets.of(namespace);
  }

  Io.socketAuth = function(socket) {

    socket.use(socketioJwt.authorize({
      secret: config.secret,
      handshake: true
    }));

    socket.use(function(data, accept) {
      data.user = JSON.parse(decodeURI(data.decoded_token));
      accept();
    });
  };

  Io.aggregateAsset('js', '../lib/socket.io-client/socket.io.js');

  return Io;
});
