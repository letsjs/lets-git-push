'use strict';

var
    exec = require('child_process').exec,
    lets = require('lets');

exports.logPrefix = 'lets-git-push: ';


exports.deploy = lets.plugin(function (stage) {
  exports._deploy(stage);
});

exports._deploy = function (stage) {
  stage.on('deploy', function (options, next) {
    exports.exec('git push ' + options.remote + ' ' + options.branch, function (err) {
      if(err) {
        err = exports.logPrefix + err;
      }

      next(err);
    });
  });
};

exports.exec = function (command, callback) {
  lets.logger.info(exports.logPrefix + 'executing: ' + command);

  exec(command, function (err, stdout, stderr) {
    lets.logger.debug(exports.logPrefix + 'stdout: ' + stdout);
    callback(stderr || null);
  });
};
