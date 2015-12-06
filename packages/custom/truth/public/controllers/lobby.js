'use strict';

/* jshint -W098 */
angular.module('mean.truth').controller('LobbyController', ['$scope', '$stateParams', 'Global', 'Io',
  function($scope, $stateParams, Global, Io) {
    var timeout;
    $scope.global = Global;

    $scope.$on('$destroy', function(){
      clearInterval(timeout);
      Io.close();
    });

    function confirmGameInstanceId() {
      Io.emit('confirmGameInstanceId');
    }

    Io.connect($stateParams.id, 'lobby');

    Io.on('lobbyUpdate', function(data) {
      $scope.lobby = data.lobby;
      if($scope.lobby.gameInstanceId) {
        confirmGameInstanceId();
        clearInterval(timeout);
      }
      $scope.$apply();
    });

    function checkIn() {
      Io.emit('checkIn');
      timeout = setTimeout(checkIn, 1000);
    }

    checkIn();

  }
]);
