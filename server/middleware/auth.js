// Re-export the protect middleware as default for backward compatibility
const { protect } = require('./authMiddleware');
module.exports = protect;