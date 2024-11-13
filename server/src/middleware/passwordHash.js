const bcrypt = require('bcryptjs');

const hashPassword = async (req, res, next) => {
  try {
    if (!req.body.password) return next();
    
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = hashPassword; 