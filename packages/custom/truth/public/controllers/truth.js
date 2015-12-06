'use strict';

/* jshint -W098 */
angular.module('mean.truth').controller('TruthController', ['$scope', 'Global', 'Truth',
  function($scope, Global, Truth) {
    $scope.global = Global;
    $scope.package = {
      name: 'truth'
    };
  }
]);
