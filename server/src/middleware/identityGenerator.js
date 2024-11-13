const crypto = require('crypto');
const User = require('../models/User');

const generateIdentityNo = async () => {
  try {
    let isUnique = false;
    let generatedId;

    while (!isUnique) {
      // Generate random 8-character string
      let bytes = crypto.randomBytes(32);
      generatedId = '';
      
      // Generate exactly 8 letters
      while (generatedId.length < 8) {
        const char = String.fromCharCode(65 + (bytes[generatedId.length] % 26));
        generatedId += char;
      }

      // Check if it's unique
      const existingUser = await User.findOne({ identityNo: generatedId });
      if (!existingUser) {
        isUnique = true;
      }
    }

    return generatedId;
  } catch (error) {
    throw error;
  }
};

module.exports = generateIdentityNo;