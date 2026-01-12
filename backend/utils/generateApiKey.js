const crypto = require("crypto");

module.exports = function generateApiKey() {
    return "apip" + crypto.randomBytes(24).toString("hex");
};
