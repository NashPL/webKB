const crypto = require('crypto');

module.exports = class _Utils {
  static getHashedValue() {
    let sha = crypto.createHash('sha256');
    sha.update(Math.random().toString());
    return sha.digest('hex');
  }
}