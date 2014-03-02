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


/* Tests
============================================================================= */

describe('After the Letsfile has been loaded', function () {
  before(function () {
    config = lets.load(letsfile);
  });

  describe('gitPush._deploy', function () {
    it('has been called once', function () {
      gitPush._deploy.callCount.should.equal(1);
    });
  });
});

describe('After tasks have been run', function () {
  before(function (done) {
    lets.runTasks(config, 'deploy', 'testing', done);
  });

  describe('gitPush executed', function () {
    it('git push <remote> <localBranch>', function () {
      gitPush.exec.should.have.been
        .calledWithExactly('git push testing master', sinon.match.func);
    });
  });
});
