'use strict';

angular.module('mean').factory('Io', [
  function() {
    var socket;

    return {
      connect: function (id, namespace) {
        socket = io(location.host + '/' + namespace, {
          query: 'token=' + localStorage.getItem('JWT') + '&id=' + id,
          forceNew: true
        });
        socket.on('connect', function () {
          //console.log('authenticated');

        }).on('disconnect', function () {
          //console.log('disconnected');
        }).on('error', function (error) {
          //console.log('error', error);
          socket.close();
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
          //console.log('event:', eventName);
          var args = arguments;
          if (callback) {
            callback.apply(socket, args);
          }
        });
      }
    };
  }
]);
