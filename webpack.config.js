const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: './script.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build'),
  },
  plugins: [
    new Dotenv()
  ],
};