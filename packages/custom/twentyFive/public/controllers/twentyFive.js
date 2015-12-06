'use strict';

/* jshint -W098 */
angular.module('mean.twentyFive').controller('TwentyFiveController', ['$scope', '$stateParams', 'Global', 'Io',
  function($scope, $stateParams, Global, Io) {
    $scope.global = Global;

    $scope.$on('$destroy', function(){
      Io.close();
    });

    $scope.selectCard = function(cardIndex) {
      Io.emit('selectCard', { cardIndex: cardIndex });
    };

    Io.connect($stateParams.gameInstanceId, 'twentyFive');

    Io.on('gameInstanceUpdate', function(data) {
      $scope.gameInstance = data.gameInstance;
      $scope.$apply();
    });
  }
]);
