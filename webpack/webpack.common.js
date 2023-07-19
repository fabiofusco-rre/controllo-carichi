const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, '..', 'app', 'frontend', 'src', 'index.js'),
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, '..', 'app', 'frontend', 'dist')
  }
}