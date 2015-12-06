'use strict';

angular.module('mean.twentyFive').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('Twenty Five', {
      url: '/twentyFive/:gameInstanceId',
      templateUrl: 'twentyFive/views/index.html'
    });
  }
]);
