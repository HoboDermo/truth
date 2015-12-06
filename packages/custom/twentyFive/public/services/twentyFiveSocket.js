'use strict';

angular.module('mean.twentyFive').factory('TwentyFiveSocket', [
  function() {
    var socket;

    return {
      connect: function (gameInstanceId) {
        socket = io(location.host + '/twentyFive', {
          query: 'token=' + localStorage.getItem('JWT') + '&gameInstanceId=' + gameInstanceId,
          'force new connection': true
        });
        socket.on('connect', function () {
          console.log('authenticated');

        }).on('disconnect', function () {
          console.log('disconnected');
        });
      },
      close: function () {
        socket.close();
      },
      on: function (eventName, callback) {
        socket.on(eventName, function () {
          var args = arguments;
          callback.apply(socket, args);
        });
      },
      emit: function (eventName, data, callback) {
        socket.emit(eventName, data, function () {
          console.log('event:', eventName);
          var args = arguments;
          if (callback) {
            callback.apply(socket, args);
          }
        });
      }
    };
  }
]);
