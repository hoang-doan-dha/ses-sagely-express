const auth = require('../auth');

async function authenticate (req, res, next) {
  const { username, password } = req.body;
  try {
    const data = await auth.authenticate(username, password);
    if (data.data) {
      // Solution 1. Save data in the request
      // req.token = data.data.token;

      // Solution 2. Saving in local variables, it's only existed during that request/response cycle
      res.locals.token = data.data.token;
      next();
    } else {
      next(new Error('Not find token.'));
    }
  } catch (error) {
    console.log(error);
    next(new Error('Wrong username and password.'));
  }
}

async function validate (req, res, next) {
  const { token } = res.locals;
  if (token) {
    auth.setAuth(token);
    try {
      const data = await auth.validate(token);
      
      if (data.data && data.data.payload) {
        res.locals.displayName = data.data.payload.displayName;
        res.locals.token = data.data.token;
      }
      // req.isLoggedIn = true;
      res.locals.isLoggedIn = true;
      next();
    } catch (error) {
      console.log(error);
      next(new Error('Failed in validation.'));
    }
  } else {
    next(new Error('Not find token.'));
  }
}

module.exports = {
  authenticate,
  validate
};