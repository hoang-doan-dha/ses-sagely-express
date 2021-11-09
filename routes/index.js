var express = require("express");
var router = express.Router();
const { authenticate, validate, setAuth } = require("../auth");

const API_URL = "http://54.255.38.53:7111/";

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "SES-Mock Sagely GUI" });
});

router.get("/login", function (req, res) {
  res.render("login");
});

router.post("/login", async function (req, res) {
  const { username, password } = req.body;
  try {
    const data = await authenticate(username, password);
    console.log("token", data.data);
    if (data.data) {
      setAuth(data.data.token);
      try {
        const user = await validate();
        console.log("user login success", user);
        res.redirect("/");
      } catch (error) {
        console.log(error);
        res.send("Error in validation");
      }
    }
  } catch (error) {
    res.send("Error in authentication");
  }
});

module.exports = router;
