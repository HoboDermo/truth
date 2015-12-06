
var Ranks = {
  "Trump": {
    "5": 17,
    "11": 16, //Jack
    //"": 15 //Ace of Hearts
    "1": 14 //Ace
  },
  "Black": {
    "13": 13, //King
    "12": 12, //Queen
    "11": 11, //Jack
    "1": 10, //Ace
    "2": 9,
    "3": 8,
    "4": 7,
    "5": 6,
    "6": 5,
    "7": 4,
    "8": 3,
    "9": 2,
    "10": 1
  },
  "Red": {
    "13": 13, //King
    "12": 12, //Queen
    "11": 11, //Jack
    "10": 10,
    "9": 9,
    "8": 8,
    "7": 7,
    "6": 6,
    "5": 5,
    "4": 4,
    "3": 3,
    "2": 2,
    "1": 1 //Ace
  }
};

var cardHelpers = {
  isRankedHigherThan: function(card1, card2, trumpSuit, initialSuit) {
    var thisIsTrump = cardHelpers.isTrump(card1, trumpSuit),
      cardIsTrump = cardHelpers.isTrump(card2, trumpSuit);
    if(thisIsTrump && cardIsTrump) {
      return (cardHelpers.value(card1, true) >= cardHelpers.value(card2, true));
    }
    if(thisIsTrump && !cardIsTrump) {
      return true;
    }
    if(!thisIsTrump && cardIsTrump) {
      return false;
    }
    if(card1.suit === card2.suit) {
      return (cardHelpers.value(card1,false) >= cardHelpers.value(card2,false));
    }
    if(card2.suit === initialSuit) {
      return false;
    }
    return true;
  },
  value: function(card, isTrump) {
    var value;
    if(isTrump && Ranks.Trump[card.rank] !== undefined) {
      value = Ranks.Trump[card.rank];
    } else if(cardHelpers.isAceOfHearts(card)) {
      value = 15;
    } else {
      value = Ranks[card.suit.Colour][card.rank];
    }
    return value;
  },
  isTrump: function(card, trumpSuit) {
    return card.suit === trumpSuit || cardHelpers.isAceOfHearts(card);
  },
  isAceOfHearts: function(card) {
    return (card.suit.Name === "Hearts" && card.rank === 1);
  },
  markSelectable: function(trump, allInPlay, cardsToCheck) {
    var markAllSelectable = true;

    if(allInPlay.length && cardHelpers.isTrump(allInPlay[0], trump.suit)) {
      //First card is a trump
      //Must play a trump if have one
      //Except for 5, J or AoH unless first card is of higher value

      cardsToCheck.forEach(function(cardToCheck) {
        var cardIsTrump = cardHelpers.isTrump(cardToCheck, trump.suit);
        if(cardIsTrump) {
          var firstCardValue = null;cardHelpers.value(allInPlay[0], true);
          var isCardJackFiveOrAoH = cardHelpers.value(cardToCheck, true) >= 15;
          cardToCheck.selectable = true;

          if(markAllSelectable && (!isCardJackFiveOrAoH ||
            firstCardValue >= cardHelpers.value(cardToCheck, true))) {

            markAllSelectable = false;
          }
        } else {
          cardToCheck.selectable = false;
        }
      });
    }
    if(markAllSelectable) {
      cardsToCheck.forEach(function(cardToCheck) {
        cardToCheck.selectable = true;
      });
    }
    return cardsToCheck;
  }
};

module.exports = {
  cardHelpers: cardHelpers
};
