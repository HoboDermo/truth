'use strict';

angular.module('mean.truth').config(['$stateProvider', '$viewPathProvider',
  function($stateProvider, $viewPathProvider) {

    $viewPathProvider.override('system/views/index.html', 'truth/views/dashboard.html');

    $stateProvider.state('Lobby', {
      url: '/truth/lobby/:id',
      templateUrl: 'truth/views/lobby.html'
    });
  }
]);
