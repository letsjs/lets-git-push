'use strict';

/*global it:true, describe:true, before:true*/
/*jshint unused:false*/

var
    chai = require('chai'),
    expect = chai.expect,
    sinon = require('sinon'),
    sinonChai = require('sinon-chai'),
    lets = require('lets'),
    gitPush = require('../.'),
    letsfile = require('./Letsfile'),
    config;

chai.should();
chai.use(sinonChai);


/* Mocks and stubs
============================================================================= */

sinon.spy(gitPush, '_deploy');
gitPush.exec = sinon.spy(function (cmd, callback) {
  callback();
});

// Prevent event from exiting process
lets.logger.on('error', function () {});


/* Tests
============================================================================= */

describe('With only local branch set,', function () {
  describe('after the Letsfile has been loaded,', function () {
    before(function () {
      config = lets.load(letsfile);
    });

    describe('gitPush._deploy', function () {
      it('has been called once', function () {
        var _ = gitPush._deploy.should.have.been.called;
      });
    });
  });

  describe('after tasks have been run,', function () {
    before(function (done) {
      lets.runTasks(config, 'deploy', 'testing', done);
    });

    describe('gitPush executed', function () {
      it('`git push <remote> <localBranch>`', function () {
        gitPush.exec.firstCall.should.have.been
          .calledWithExactly('git push testing master', sinon.match.func);
      });
    });
  });
});

describe('With only different local and remote branch set,', function () {
  describe('after tasks have been run,', function () {
    before(function (done) {
      lets.runTasks(config, 'deploy', 'testing2', done);
    });

    describe('gitPush executed', function () {
      it('`git push <remote> <localBranch>:<remoteBranch>`', function () {
        gitPush.exec.secondCall.should.have.been
          .calledWithExactly('git push testing2 master:develop', sinon.match.func);
      });
    });
  });
});

describe('With no remote set,', function () {
  before(function (done) {
    lets.logger.error = sinon.spy();
    lets.runTasks(config, 'deploy', 'testing3', function () {
      done();
    });
  });

  it('should callback an error', function () {
    var errorString = 'lets-git-push: options.remote must be set';

    lets.logger.error.should.have.been
      .calledWithMatch(sinon.match(function (err) {
        return err.message === errorString;
      }, errorString));
  });
});

describe('With no branch set,', function () {
  before(function (done) {
    lets.logger.error = sinon.spy();
    lets.runTasks(config, 'deploy', 'testing4', function () {
      done();
    });
  });

  it('should callback an error', function () {
    var errorString = 'lets-git-push: options.branch or options.localBranch must be set';

    lets.logger.error.should.have.been
      .calledWithMatch(sinon.match(function (err) {
        return err.message === errorString;
      }, errorString));
  });
});
