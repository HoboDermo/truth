'use strict';

var socketio = require('socket.io');

module.exports = function(http) {

  return socketio.listen(http);
};