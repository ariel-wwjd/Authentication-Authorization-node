const NodeCache = require('node-cache');

const oneHourTimeToLive = 3600;
const checkForExpiredEveryTwoMinutes = 120;

const nodeCache = new NodeCache({
  stdTTL: oneHourTimeToLive,
  checkperiod: checkForExpiredEveryTwoMinutes
});

module.exports = { nodeCache };
