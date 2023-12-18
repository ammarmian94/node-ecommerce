const passport = require("passport");

exports.isAuth = (req, res, done) => {
  // console.log("is auth");
  return passport.authenticate("jwt");
};

exports.sanitizeUser = (user) => {
  // console.log("sss---- ",user)
  return { id: user.id, role: user.role };
};

exports.cookieExtractor = function (req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }
  // TODO: this is temporary token for testing without cookie
  token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NzIxNzBiMGFhMmJlMmVjOTNlZjJmOSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcwMjkyODg0MH0.LEw7-aGvTrr-Ik61pzBpyam6Wa1gATl0n8OaOvejLzU"
  return token;
};
