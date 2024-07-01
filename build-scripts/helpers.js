const path = require('path');

const cwd = process.cwd();

function pathResolve(relativePath) {
  return path.resolve(cwd, relativePath);
}

module.exports = {
  pathResolve
};
