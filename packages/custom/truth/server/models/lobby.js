'use strict';
/*
 Represents game lobby
 TODO: Allow rollback from closed to ready if player leaves
 TODO: Update to support real time updates and heartbeat
 */
function Lobby(base) {
  this.gameDefinition = base.gameDefinition || null;
  this.players = base.players || [];
  this.isReady = base.isReady || false;
  this.timeDeclaredReady = base.timeDeclaredReady || null;
  this.isClosed = base.isClosed || false;
  this.timeClosed = base.timeClosed || null;
  this.gameInstanceId = base.gameInstanceId || null;
  this.canRemove = base.canRemove || false;
  this.status = 'Waiting';
}

var updateCurrentPlayers = function() {
  var playerTimeout = 20000;
  this.players = this.players.filter(function(player) {
    return  player.lastCheckIn + playerTimeout > Date.now();
  });
};

var updateReadyStatus = function() {
  var minPlayers = this.gameDefinition.minPlayers;
  var maxPlayers = this.gameDefinition.maxPlayers;
  var currentPlayers = this.players.length;

  if(currentPlayers >= minPlayers && currentPlayers <= maxPlayers) {
    this.isReady = true;
    this.timeDeclaredReady = this.timeDeclaredReady || Date.now();
  } else {
    this.isReady = false;
    this.timeDeclaredReady = null;
  }
};

var updateClosedStatus = function() {
  var readyTimeout = 5000;
  if(this.isReady && !this.isClosed &&
    Date.now() > this.timeDeclaredReady + readyTimeout) {

    this.isClosed = true;
    this.timeClosed = Date.now();
  }
};

var updateCanRemoveStatus = function() {
  if(this.isReady && this.isClosed && this.gameInstanceId && !this.canRemove) {
    if(this.players.every(function(player) {
        return player.hasReceivedGameInstanceInfo;
      })) {
      this.canRemove = true;
    }
  }
};

var getPlayer = function getPlayer(id) {
  var matchingPlayers = this.players.filter(function(player) {
    return player.playerData._id === id;
  });
  if(matchingPlayers.length !== 1) {
    return null;
  }
  return matchingPlayers[0];
};

Lobby.prototype.sanitize = function(userId) {
  return {
    gameDefinition: this.gameDefinition.sanitize(),
    players: this.players.map(function(player) {
      return {
        playerData: player.playerData, //TODO: Update so user data doesn't get exposed
        joinTime: player.joinTime,
        lastCheckIn: player.lastCheckIn,
        updateCallback: function() {}
      };
    }),
    isReady: this.isReady,
    timeDeclaredReady: this.timeDeclaredReady,
    isClosed: this.isClosed,
    timeClosed: this.timeClosed,
    gameInstanceId: this.gameInstanceId,
    status: this.status //TODO: Update this
  };
};

Lobby.prototype.checkStatus = function() {
  var originalReady = this.isReady;
  var originalClosed = this.isClosed;
  var originalCanRemove = this.canRemove;

  updateCurrentPlayers.call(this);
  updateReadyStatus.call(this);
  updateClosedStatus.call(this);
  updateCanRemoveStatus.call(this);

  return {
    readyChange: originalReady !== this.isReady,
    closedChange: originalClosed !== this.isClosed,
    canRemoveChange: originalCanRemove !== this.canRemove
  };
};

Lobby.prototype.getUpdate = function(userId, data) {
  if(typeof(data.callback) === 'function')
    getPlayer.call(this, userId).updateCallback = data.callback;

  return this.sanitize(userId);
};

Lobby.prototype.sendPlayerUpdate = function() {
  this.players.forEach(function(player) {
    player.updateCallback(this);
  }, this)
};

Lobby.prototype.checkStatusForUser = function(id) {

  var existingPlayer = getPlayer.call(this, id);

  if(existingPlayer !== null) {
    existingPlayer.lastCheckIn = Date.now();

    return this.checkStatus();
  }
  return null;
};

Lobby.prototype.addPlayer = function(player) {
  var existingPlayer = getPlayer.call(this, player._id);

  if(existingPlayer !== null) {
    existingPlayer.lastCheckIn = Date.now();
    return true;
  }
  if(!this.isClosed &&
    this.players.length < this.gameDefinition.maxPlayers) {

    var now = Date.now();
    this.players.push({
      playerData: player,
      joinTime: now,
      lastCheckIn: now,
      hasReceivedGameInstanceInfo: false
    });
    return true;
  }
  return false;
};

Lobby.prototype.updatePlayerGameInstanceIdFlag = function(id) {
  var existingPlayer = getPlayer.call(this, id);
  if(existingPlayer !== null && this.gameInstanceId !== null) {
    existingPlayer.hasReceivedGameInstanceInfo = true;
  }
};


module.exports = Lobby;
