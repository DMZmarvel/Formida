module.exports = function generateRef(length = 8) {
  return Math.random().toString(36).substr(2, length).toUpperCase();
};
