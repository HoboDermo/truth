'use strict';

angular.module('mean.truth').factory('Dashboard', ['$resource',
  function($resource) {
    return $resource('api/truth/dashboard/');
  }
]);
