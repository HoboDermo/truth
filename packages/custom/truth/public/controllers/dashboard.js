'use strict';

/* jshint -W098 */
angular.module('mean.truth').controller('DashboardController', ['$scope', 'Global', 'Dashboard',
  function($scope, Global, Dashboard) {
    $scope.global = Global;
    Dashboard.get(function(dashboard) {
      $scope.dashboard = dashboard;
    });
  }
]);
