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

    // Guards
    if(!options.remote) {
      return next(new Error('lets-git-push: `options.remote` must be set'));
    }

    if(!options.branch && !options.localBranch) {
      return next(new Error('lets-git-push: `options.branch` or `options.localBranch` must be set'));
    }

    // Support different local and remote branch, fall back to default git
    // behavior if only one is specified
    localBranch = options.localBranch || options.branch;

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
  lets.logger.info(exports.logPrefix + 'executing: `' + command + '`');

  exec(command, function (err, stdout, stderr) {
    lets.logger.debug(exports.logPrefix + 'stdout: ' + stdout);

    if(stderr) {
      lets.logger.error(exports.logPrefix + 'stderr: ' + stderr);
    }

    callback(err || null);
  });
};
