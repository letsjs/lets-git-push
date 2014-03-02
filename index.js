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
    var command = 'git push ' + options.remote,
        localBranch;

    localBranch = options.localBranch || options.branch;

    // Support different lcoal and remote branch, fall back to default git
    // behavior if only one is specified
    if(options.remoteBranch && options.remoteBranch !== localBranch) {
      command += ' ' + localBranch + ':' + options.remoteBranch;
    }
    else {
      command += ' ' + localBranch;
    }

    exports.exec(command, function (err) {
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
