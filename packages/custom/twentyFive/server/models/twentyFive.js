'use strict';

var Deck = require('../models/standardDeck');
var cardHelpers = require('../helpers/utilities').cardHelpers;

function Game(gameData) {
  this.players = gameData.players.map(function(player) {
    return {
      playerData: player.playerData,
      inHand: [],
      inPlay: null,
      score: 0,
      updateCallback: function() {}
    };
  });

  this.deck = new Deck();
  this.trumpCard = null;
  this.history = [];
  this.initialPlayerIndex = 0;
}

Game.prototype.sendPlayerUpdate = function() {
  this.players.forEach(function(player) {
    player.updateCallback(this);
  }, this)
};

Game.prototype.getCardsInPlay = function() {
  var cardsInPlay = [];
  for(var i = 0, indexPointer = this.initialPlayerIndex;
      i < this.players.length; i++, indexPointer++) {

    if(indexPointer === this.players.length) indexPointer = 0;
    if(this.players[indexPointer].inPlay) {
      cardsInPlay.push(this.players[indexPointer].inPlay);
    }

  }
  return cardsInPlay;
};

Game.prototype.getPlayerById = function(id) {
  var matchingPlayers = this.players.filter(function(player) {
    return player.playerData._id === id;
  });
  if(matchingPlayers.length !== 1) {
    return null;
  }
  return matchingPlayers[0];
};

Game.prototype.sanitize = function(userId) {
  return {
    players: this.players.map(function(player) {
      return {
        playerData: player.playerData,//.sanitize(userId),
        inHand: player.playerData._id === userId ? player.inHand :
          player.inHand.map(function(card) {
            return {};
          }),
        inPlay: player.inPlay,
        score: player.score
      };
    }, this),
    trumpCard: this.trumpCard,
    deckSize: this.deck.cards.length,
    history: this.history,
    playersCards: this.getPlayersCards(userId)
  };
};

Game.prototype.getPlayersCards = function(userId) {
  return this.getPlayerById(userId).inHand;
};

Game.prototype.deal = function(gameData, goToNextState) {
  var i;

  /* Populate the deck & shuffle */
  this.deck = new Deck();
  this.deck.shuffle();

  /* Deal 5 cards to each player */
  for(i = 0; i < 5; i++) {
    this.players.forEach(function(player) {
      player.inHand.push(this.deck.drawCard());
    }, this);
  }
  this.history.unshift('Dealer: 5 cards to each player.');
  /* Reveal trump card */
  this.trumpCard = this.deck.drawCard();
  this.history.unshift('Dealer: Trump card is ' + this.trumpCard.description + '.');
  gameData.currentPlayerIndex = this.initialPlayerIndex;
  //TODO: Handle if trump card is Ace
  goToNextState();
  this.sendPlayerUpdate();
};

Game.prototype.playerAction = function(gameData, goToNextState) {
  var game = this;
  this.players.forEach(function(player, index) {
    if(index === gameData.currentPlayerIndex) {
      cardHelpers.markSelectable(game.trumpCard, game.getCardsInPlay(), player.inHand);
    } else {
      player.inHand.forEach(function(card) {
        card.selectable = false;
      });
    }
  });

  this.history.unshift(this.players[gameData.currentPlayerIndex].playerData.username +
    ': Awaiting card choice.');
  this.sendPlayerUpdate();
  return null;
};

Game.prototype.isEndOfHand = function(gameData) {
  return this.players.every(function(player) {
    return player.inPlay !== null;
  });
};

Game.prototype.endOfHand = function(gameData, goToNextState) {
  var trumpSuit = this.trumpCard.suit;
  var initialSuit = this.players[this.initialPlayerIndex].inPlay.suit;
  var winnerIndex = 0;
  var bestCardPlayer = this.players.reduce(function(leadingPlayer, checkPlayer, currentIndex) {
    var isLeadingPlayerRankedHigher = cardHelpers.isRankedHigherThan(leadingPlayer.inPlay,
      checkPlayer.inPlay, trumpSuit, initialSuit);

    if(isLeadingPlayerRankedHigher) {
      return leadingPlayer;
    } else {
      winnerIndex = currentIndex;
      return checkPlayer;
    }
  });
  this.history.unshift('Dealer: ' + bestCardPlayer.playerData.username +
    ' wins the hand with the ' + bestCardPlayer.inPlay.description + '.');
  bestCardPlayer.score += 5;
  this.players.forEach(function(player) {
    player.inPlay = null;
  });
  gameData.currentPlayerIndex = winnerIndex;
  this.initialPlayerIndex = gameData.currentPlayerIndex;
  goToNextState();
  this.sendPlayerUpdate();
};

Game.prototype.isEndOfMatch = function(gameData) {
  return this.players.every(function(player) {
    return player.inHand.length === 0;
  });
};

Game.prototype.isEndOfGame = function(gameData) {
  var winner = null;
  var result = this.players.some(function(player) {
    if(player.score === 25) {
      winner = player;
      return true;
    } else {
      return false;
    }
  });
  if(result) {
    this.history.unshift('Dealer: ' + winner.playerData.username +
      ' wins the game.');
  }
  return result;
};

Game.prototype.getUpdate = function(gameData, userId, data, goToNextState) {
  if(typeof(data.callback) === 'function')
    this.getPlayerById(userId).updateCallback = data.callback;

  return this.sanitize(userId);
};

Game.prototype.sendData = function(gameData, userId, data, goToNextState) {
  if(gameData.state === 'PLAYER_ACTION' &&
    this.players[gameData.currentPlayerIndex].playerData._id === userId) {

    var currentPlayer = this.getPlayerById(userId);

    if(!currentPlayer.inHand[data.cardIndex].selectable) {
      return false;
    }

    currentPlayer.inPlay =
      currentPlayer.inHand.splice(data.cardIndex, 1)[0];

    this.history.unshift(currentPlayer.playerData.username +
      ': Plays the ' + currentPlayer.inPlay.description + '.');
    goToNextState();
    this.sendPlayerUpdate();
    return true;
  }
  return false;
};

module.exports = Game;
