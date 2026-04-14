const { usersDB } = require('../services/database');

exports.authorize = (roles = []) => {
  return async (req, res, next) => {
    try {
      const user = await usersDB.findOne({ _id: req.userId });

      if (!user || !roles.includes(user.role)) {
        return res.status(403).json({ message: 'Insufficient permissions' });
      }

      next();
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Authorization error', error: error.message });
    }
  };
};