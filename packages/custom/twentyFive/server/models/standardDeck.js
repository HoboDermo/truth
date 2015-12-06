

var Suits = [
  {
    Name: "Hearts",
    Colour: "Red"
  },
  {
    Name: "Spades",
    Colour: "Black"
  },
  {
    Name: "Diamonds",
    Colour: "Red"
  },
  {
    Name: "Clubs",
    Colour: "Black"
  }
];

function Card(suit, rank) {
  this.suit = suit;
  this.rank = rank;
  this.description = getDescription();

  function getDescription() {
    var rankText = "";

    switch(rank) {
      case 1:
        rankText = "Ace";
        break;
      case 11:
        rankText = "Jack";
        break;
      case 12:
        rankText = "Queen";
        break;
      case 13:
        rankText = "King";
        break;
      default:
        rankText = rank;
    }

    return rankText + " of " + suit.Name;
  }
}

function StandardDeck() {
  this.cards = [];

  /** Populate a new 52 card deck */
  for(var i = 0; i < Suits.length; i++) {
    for(var j = 1; j < 14; j++) {
      this.cards.push(new Card(Suits[i], j));
    }
  }
}

StandardDeck.prototype.shuffle = function() {
  var i = this.cards.length, j, tempI, tempJ;
  if ( i === 0 ) return false;
  while ( --i ) {
    j = Math.floor( Math.random() * ( i + 1 ) );
    tempI = this.cards[i];
    tempJ = this.cards[j];
    this.cards[i] = tempJ;
    this.cards[j] = tempI;
  }
  return true;
};

StandardDeck.prototype.drawCard = function() {
  if(this.cards.length > 0) {
    return this.cards.splice(0,1)[0];
  }
  return null;
};

module.exports = StandardDeck;
