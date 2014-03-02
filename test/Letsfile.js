'use strict';

var gitPush = require('../.');


module.exports = function (lets) {
  var testing = lets.Stage();

  testing.plugin(gitPush.deploy({
    branch: 'master',
    remote: 'testing'
  }));

  lets.addStage('testing', testing);
};
