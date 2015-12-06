var GameDefinition = require('../models/gameDefinition');

var games = [];

var gameDefinitionsProvider = {
  getById: function(id, done) {
    var matchingGames = games.filter(function(game) {
      return game.id == id;
    });
    if(matchingGames.length != 1) {
      done("Game not found");
    }
    done(null, matchingGames[0]);
  },
  getAll: function(done) {
    done(null, games);
  },
  registerGameDefinition: function(options) {
    games.push(new GameDefinition(options));
  }
};

module.exports = gameDefinitionsProvider;
