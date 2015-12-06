'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Truth = new Module('truth');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Truth.register(function(app, http, auth, database, io) {

  //We enable routing. By default the Package Object is passed to the routes
  Truth.routes(app, io, auth, database);

  Truth.aggregateAsset('css', 'truth.css');

  return Truth;
});
