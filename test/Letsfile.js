'use strict';

var gitPush = require('../.');


module.exports = function (lets) {
  var testing = lets.Stage();

  testing.plugin(gitPush.deploy({
    branch: 'master',
    remote: 'testing'
  }));

  lets.addStage('testing', testing);

  lets.addStage('testing2', lets.Stage()
    .plugin(gitPush.deploy({
      remote: 'testing2',
      branch: 'master',
      remoteBranch: 'develop'
    })));

  lets.addStage('testing3', lets.Stage()
    .plugin(gitPush.deploy({
      branch: 'master'
    })));

  lets.addStage('testing4', lets.Stage()
    .plugin(gitPush.deploy({
      remote: 'testing4'
    })));
};
