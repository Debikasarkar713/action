require('babel-core/register');
require('babel-polyfill');
const path = require('path');
const resolve = require('resolve'); // eslint-disable-line import/no-extraneous-dependencies

require('babel-register')({ // eslint-disable-line import/no-extraneous-dependencies
  resolveModuleSource(source, filename) {
    return resolve.sync(source, {
      basedir: path.resolve(filename, '..'),
      extensions: ['.js'],
      moduleDirectory: [
        'src',
        'node_modules'
      ]
    });
  }
});
require('./migrate.js');
