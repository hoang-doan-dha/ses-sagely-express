function loginErrorHandler (err, req, res, next) {
  res.status(500).render('login', { error: err.message });
}

exports.loginErrorHandler = loginErrorHandler;