
/*
 Represents game definition
 */
function GameDefinition(base) {
  this.id = base.id || null;
  this.name = base.name || null;
  this.minPlayers = base.minPlayers || 2;
  this.maxPlayers = base.maxPlayers || 2;
  this.Game = base.Game || null;
}

GameDefinition.prototype.sanitize = function() {
  return {
    id: this.id,
    name: this.name,
    minPlayers: this.minPlayers,
    maxPlayers: this.maxPlayers
  };
};

module.exports = GameDefinition;
