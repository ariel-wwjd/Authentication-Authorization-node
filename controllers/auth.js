const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { usersDB, userRefreshTokensDB } = require('../services/database');
const { nodeCache } = require('../services/serverSideCache');
const { verify } = require('otplib');

exports.register = async (request, response) => {
  try {
    const { username, email, password, role } = request.body;

    if (!username || !email || !password) {
      return response
        .status(422)
        .json({ message: 'Please provide username, email and password' });
    }

    if (await usersDB.findOne({ email })) {
      return response.status(409).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await usersDB.insert({
      username,
      email,
      password: hashedPassword,
      role: role ?? 'member',
      twoFactorEnabled: false,
      twoFactorSecret: null
    });
    return response
      .status(201)
      .json({
        message: 'User registered successfully',
        username,
        id: newUser._id
      });
  } catch (error) {
    return response
      .status(500)
      .json({ message: 'register error', error: error.message });
  }
};

exports.login = async (request, response) => {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return response
        .status(422)
        .json({ message: 'Please provide email and password' });
    }

    const user = await usersDB.findOne({ email });

    if (!user) {
      return response.status(401).json({ message: 'User invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return response.status(401).json({ message: 'User invalid credentials' });
    }

    if (user.twoFactorEnabled) {
      const temporaryToken = crypto.randomBytes(32).toString('hex');
      const cacheKey = config.cacheTemporaryCachePrefix + temporaryToken;
      const expirationTime = config.cacheTemporaryTokenExpiresInSeconds;
      nodeCache.set(cacheKey, user._id, expirationTime);

      return response.status(200).json({
        message:
          'Two-factor authentication enabled. Please provide the one-time password from your authenticator app.',
        temporaryToken,
        expiresIn: expirationTime
      });
    } else {
      const accessToken = jwt.sign({ userId: user._id }, config.accessToken, {
        subject: 'accessAPI',
        expiresIn: config.accessTokenExpiresIn
      });
      const refreshToken = jwt.sign({ userId: user._id }, config.refreshToken, {
        subject: 'refreshAPI',
        expiresIn: config.refreshTokenExpiresIn
      });

      await userRefreshTokensDB.insert({ userId: user._id, refreshToken });

      return response
        .status(200)
        .json({
          message: 'Login successful',
          id: user._id,
          username: user.username,
          accessToken,
          refreshToken
        });
    }
  } catch (error) {
    return response
      .status(500)
      .json({ message: 'login error', error: error.message });
  }
};

exports.loginTwoFactor = async (request, response) => {
  try {
    const { temporaryToken, oneTimePassword } = request.body;

    if (!temporaryToken || !oneTimePassword) {
      return response
        .status(422)
        .json({
          message: 'Please provide temporary token and one-time-password'
        });
    }

    const userId = nodeCache.get(
      config.cacheTemporaryCachePrefix + temporaryToken
    );

    if (!userId) {
      return response
        .status(401)
        .json({ message: 'Invalid or expired temporary token' });
    }

    const user = await usersDB.findOne({ _id: userId });

    const verified = await verify({
      token: oneTimePassword,
      secret: user.twoFactorSecret
    });

    if (!verified.valid) {
      return response
        .status(401)
        .json({ message: 'Invalid or expired one-time-password' });
    }

    const accessToken = jwt.sign({ userId: user._id }, config.accessToken, {
      subject: 'accessAPI',
      expiresIn: config.accessTokenExpiresIn
    });
    const refreshToken = jwt.sign({ userId: user._id }, config.refreshToken, {
      subject: 'refreshAPI',
      expiresIn: config.refreshTokenExpiresIn
    });

    await userRefreshTokensDB.insert({ userId: user._id, refreshToken });

    // review if we need to delete the temporary token from cache after successful two factor authentication or if we can let it expire naturally after the configured time in cache
    // nodeCache.del(config.cacheTemporaryCachePrefix + temporaryToken);

    return response
      .status(200)
      .json({
        message: 'Two-factor authentication successful',
        accessToken,
        refreshToken,
        id: user._id,
        username: user.username
      });
  } catch (error) {
    return response
      .status(500)
      .json({
        message: 'login two factor authentication error',
        error: error.message
      });
  }
};
