
/* Creates a new GUID */
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

/* Middleware to check if user is authenticated */
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on
  res.locals.isLoggedIn = req.isAuthenticated();
  if (res.locals.isLoggedIn)
    return next();

  // throw error if not authenticated
  var err = new Error("User is not logged in");
  err.status = 401;
  return next(err);
}

function isNotFunction(possibleFunction) {
  return typeof(possibleFunction) !== "function";
}

module.exports = {
  guid: guid,
  isLoggedIn: isLoggedIn,
  isNotFunction: isNotFunction
};
