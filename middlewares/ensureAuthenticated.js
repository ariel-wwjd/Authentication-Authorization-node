const { userInvalidTokensDB } = require('../services/database');
const jwt = require('jsonwebtoken');
const config = require('../config');

exports.ensureAuthenticated = async (req, res, next) => {
  const requestAccessToken = req.headers.authorization;

  if (!requestAccessToken) {
    return res.status(401).json({ message: 'Access token missing' });
  }

  // this logic can be extracted to its own middleware
  const isUserLoggedOut = await userInvalidTokensDB.findOne({
    accessToken: requestAccessToken
  });

  if (isUserLoggedOut) {
    return res
      .status(401)
      .json({ message: 'Access token is invalid', code: 'AccessTokenInvalid' });
  }

  try {
    const decodedAccessToken = jwt.verify(
      requestAccessToken,
      config.accessToken
    );
    req.userId = decodedAccessToken.userId;
    req.accessToken = {
      value: requestAccessToken,
      expiration: decodedAccessToken.exp
    };
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res
        .status(401)
        .json({ message: 'Access token expired', code: 'AccessTokenExpired' });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res
        .status(401)
        .json({ message: 'Invalid access token', code: 'AccessTokenInvalid' });
    }

    return res
      .status(500)
      .json({ message: 'Ensure Authenticate Error', error: error.message });
  }
};