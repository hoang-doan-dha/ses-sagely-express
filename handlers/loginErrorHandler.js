function loginErrorHandler (err, req, res, next) {
  const loginErrorMessages = [
    'Wrong username and password.',
    'Not find token.',
    'Failed in validation.',
  ];
  if (loginErrorMessages.includes(err.message)) {
    res.status(500).render('login', { error: err.message });
  } else {
    next(err);
  }
}

exports.loginErrorHandler = loginErrorHandler;