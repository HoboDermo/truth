'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var TwentyFive = new Module('twentyFive');

var Game = require('./server/models/twentyFive');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
TwentyFive.register(function(app, http, auth, database, truth, io) {

  truth.registerGameDefinition({
    id: 'twentyFive',
    name: 'Twenty Five',
    minPlayers: 2,
    maxPlayers: 8,
    Game: Game
  });

  //We enable routing. By default the Package Object is passed to the routes
  TwentyFive.routes(app, io, auth, database, truth);

  TwentyFive.aggregateAsset('css', 'twentyFive.css');

  /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    TwentyFive.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    TwentyFive.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    TwentyFive.settings(function(err, settings) {
        //you now have the settings object
    });
    */

  return TwentyFive;
});
