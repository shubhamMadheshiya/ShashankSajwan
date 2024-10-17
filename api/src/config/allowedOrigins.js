const keys = require('./keys');

console.log(keys.app.adminURL, keys.app.clientURL);

const allowedOrigins = [keys.app.adminURL , keys.app.clientURL];

module.exports = allowedOrigins;
