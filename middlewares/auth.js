const auth = require('../auth');

function removeAll (req, res) {
  auth.removeToken();
  const { cookies } = req;
  for (let prop in cookies) {
    if (!cookies.hasOwnProperty(prop)) {
      continue;
    }    
    res.clearCookie(prop);
  }
}

async function authenticate (req, res, next) {
  const { username, password } = req.body;
  try {
    const data = await auth.authenticate(username, password);
    if (data.data) {
      // Solution 1. Save data in the request
      // req.token = data.data.token;

      // Solution 2. Saving in local variables, it's only existed during that request/response cycle
      res.locals.token = data.data.token;

      // res.cookie('token', data.data.token, { maxAge: 10 * 60 * 100, httpOnly: true });

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
  if (req.cookies.token || token) {
    const authToken = req.cookies.token || token;
    auth.setAuth(authToken);
    try {
      const data = await auth.validate(authToken);
      
      if (data.data && data.data.payload) {
        res.locals.displayName = data.data.payload.displayName;
        res.locals.token = data.data.token;
      }
      // req.isLoggedIn = true;
      res.locals.isLoggedIn = true;
      next();
    } catch (error) {
      console.log(error);
      removeAll(req, res);
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