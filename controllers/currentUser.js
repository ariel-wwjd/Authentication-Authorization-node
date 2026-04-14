const { usersDB } = require('../services/database');

exports.currentUser = async (request, response) => {
  try {
    const userId = request.userId;
    const user = await usersDB.findOne({ _id: userId });

    return response
      .status(200)
      .json({
        message: 'Current user retrieved successfully',
        id: user._id,
        username: user.username,
        email: user.email
      });
  } catch (error) {
    return response
      .status(500)
      .json({ message: 'login current user endpoint', error: error.message });
  }
};
