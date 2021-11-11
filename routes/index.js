var express = require("express");
var router = express.Router();
const auth = require("../auth");
const authMiddlewares = require('../middlewares/auth');

const API_URL = "http://54.255.38.53:7111/";

/* GET home page. */
router.get("/", function (req, res, next) {
  if (req.cookies.isLoggedIn) {
    res.render("index", { title: "SES-Mock Sagely GUI" });
  } else {
    res.redirect('login');
  }
});

router.get("/login", function (req, res) {
  res.render("login");
});

router.post("/login", 
  authMiddlewares.authenticate, 
  authMiddlewares.validate,
  function (req, res) {
  // const { username, password } = req.body;
  // try {
  //   const data = await authenticate(username, password);
  //   console.log("token", data.data);
  //   if (data.data) {
  //     setAuth(data.data.token);
  //     try {
  //       const user = await validate();
  //       console.log("user login success", user);
  //       res.redirect("/");
  //     } catch (error) {
  //       console.log(error);
  //       res.render('login', { error: 'Failed in validation' })
  //     }
  //   }
  // } catch (error) {
  //   res.render('login', { error: 'Wrong username or password' })
  // }
    console.log('Done login');
    if (res.locals.isLoggedIn) {
      // The maxAge option is a convenience option for setting “expires” relative to the current time in milliseconds.
      res.cookie('isLoggedIn', 1, { maxAge: 60000, httpOnly: true });
    }
    res.cookie('displayName', res.locals.displayName, { maxAge: 60000, httpOnly: true });
    res.cookie('token', res.locals.token, { maxAge: 60000, httpOnly: true });
    res.redirect("/");
  }
);

router.get('/logout', function (req, res) {
  auth.removeToken();
  const { cookies } = req;
  for (let prop in cookies) {
    console.log('prop cookie', prop);
    if (!cookies.hasOwnProperty(prop)) {
        continue;
    }    
    res.clearCookie(prop)
  }
  res.redirect('login')
});

module.exports = router;
