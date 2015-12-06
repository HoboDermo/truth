'use strict';

angular.module('mean.truth').factory('Lobby', ['$resource',
  function($resource) {
    return $resource('api/truth/lobby/:id', {
      id: '@_id'
    });
  }
]);
