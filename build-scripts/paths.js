const { pathResolve } = require('./helpers');

module.exports = {
  entry: pathResolve('src/index'),
  dist: pathResolve('dist')
};
