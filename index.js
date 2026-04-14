const express = require('express');
// const Datastore = require('nedb-promises');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const config = require('./config');
// const { generateSecret, generateURI, verify } = require('otplib');
// const qrCode = require('qrcode');
// const crypto = require('crypto');
// const NodeCache = require('node-cache');
const authRoutes = require('./routes/auth');
const currentUser = require('./routes/currentUser');

const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', currentUser);


// app.get(
//   "/api/admin",
//   ensureAuthenticated,
//   authorize(["admin"]),
//   async (req, res) => {
//     return res.status(200).json({ message: "Admin access granted" });
//   },
// );

// app.get(
//   "/api/moderator",
//   ensureAuthenticated,
//   authorize(["admin", "moderator"]),
//   async (req, res) => {
//     return res
//       .status(200)
//       .json({ message: "Admin and Moderator access granted" });
//   },
// );

// app.post("/api/auth/refresh-token", async (req, res) => {
//   try {
//     const { refreshToken } = req.body;

//     if (!refreshToken) {
//       return res.status(401).json({ message: "Refresh token missing" });
//     }

//     const decodedRefreshToken = jwt.verify(refreshToken, config.refreshToken);

//     const userStoredRefreshToken = await userRefreshTokensDB.findOne({
//       userId: decodedRefreshToken.userId,
//       refreshToken,
//     });
//     if (!userStoredRefreshToken) {
//       return res.status(401).json({ message: "Invalid refresh token" });
//     }

//     await userRefreshTokensDB.remove({ _id: userStoredRefreshToken._id });
//     // Optional: Clean up and compact the database to remove deleted tokens and optimize performance
//     await userRefreshTokensDB.compactDatafile();

//     const accessToken = jwt.sign(
//       { userId: decodedRefreshToken.userId },
//       config.accessToken,
//       { subject: "accessAPI", expiresIn: config.accessTokenExpiresIn },
//     );
//     const newRefreshToken = jwt.sign(
//       { userId: decodedRefreshToken.userId },
//       config.refreshToken,
//       { subject: "refreshAPI", expiresIn: config.refreshTokenExpiresIn },
//     );

//     await userRefreshTokensDB.insert({
//       userId: decodedRefreshToken.userId,
//       refreshToken: newRefreshToken,
//     });

//     return res
//       .status(200)
//       .json({
//         message: "Refresh token successfully updated",
//         accessToken,
//         refreshToken: newRefreshToken,
//       });

//     // return res.status(200).json({ accessToken: newAccessToken });
//   } catch (error) {
//     if (
//       error instanceof jwt.TokenExpiredError ||
//       error instanceof jwt.JsonWebTokenError
//     ) {
//       return res
//         .status(401)
//         .json({ message: "Invalid or expired refresh token" });
//     }

//     return res
//       .status(500)
//       .json({ message: "refresh token error", error: error.message });
//   }
// });

// app.get("/api/auth/logout", ensureAuthenticated, async (req, res) => {
//   try {
//     const userId = req.userId;
//     await userRefreshTokensDB.removeMany({ userId });
//     // Optional: Clean up and compact the database to remove deleted tokens and optimize performance
//     await userRefreshTokensDB.compactDatafile();

//     await userInvalidTokensDB.insert({
//       accessToken: req.accessToken.value,
//       userId: req.userId,
//       expirationTime: req.accessToken.expiration,
//     });

//     return res.status(200).json({ message: "Logout successful" });
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ message: "logout error", error: error.message });
//   }
// });

// app.get(
//   "/api/auth/two-factor-auth/generate",
//   ensureAuthenticated,
//   async (req, res) => {
//     try {
//       const user = await usersDB.findOne({ _id: req.userId });

//       const secret = generateSecret();
//       const uri = generateURI({ issuer: "HVN", label: user.email, secret });

//       await usersDB.update(
//         { _id: req.userId },
//         { $set: { twoFactorSecret: secret } },
//       );
//       await usersDB.compactDatafile();

//       const qrCodeImage = await qrCode.toBuffer(uri, {
//         type: "image/png",
//         margin: 1,
//       });
//       res.setHeader("Content-Disposition", 'attachment; filename="qrCode.png"');

//       return res.status(200).type("image/png").send(qrCodeImage);
//     } catch (error) {
//       return res
//         .status(500)
//         .json({
//           message: "two factor authentication error",
//           error: error.message,
//         });
//     }
//   },
// );

// app.post(
//   "/api/auth/two-factor-auth/validate",
//   ensureAuthenticated,
//   async (req, res) => {
//     try {
//       const { oneTimePassword } = req.body;

//       if (!oneTimePassword) {
//         return res
//           .status(422)
//           .json({
//             message:
//               "Please provide the one-time-password from the authenticator app",
//           });
//       }

//       const user = await usersDB.findOne({ _id: req.userId });

//       const verified = await verify({
//         token: oneTimePassword,
//         secret: user.twoFactorSecret,
//       });
//       if (!verified.valid) {
//         return res
//           .status(400)
//           .json({ message: "Invalid or expired one-time-password" });
//       }

//       await usersDB.update(
//         { _id: req.userId },
//         { $set: { twoFactorEnabled: true } },
//       );
//       await usersDB.compactDatafile();

//       return res.status(200).json({ message: "valid one-time-password" });
//     } catch (error) {
//       return res
//         .status(500)
//         .json({
//           message: "two factor authentication validate error",
//           error: error.message,
//         });
//     }
//   },
// );

app.listen(3000, () => {
  console.info('Server is running on port 3000');
});
