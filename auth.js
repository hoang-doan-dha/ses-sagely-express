const axios = require("axios");

const API_URL = "http://54.255.38.53:7111/";

const authenticate = async (username, password) => {
  return await axios.post(API_URL + "validate/authenticate", {
    username,
    password,
  });
};

const setAuth = (token) => {
  axios.defaults.headers.common["Authorization"] = "Bearer " + token;
};

const removeToken = () => {
  axios.defaults.headers.common["Authorization"] = null;
}

const validate = async () => {
  return await axios.post(API_URL + "validate/validate", {
    refreshUser: false,
    facilityHref: "",
  });
};

module.exports = {
  authenticate,
  setAuth,
  validate,
  removeToken
}
