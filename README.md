# lets-git-push

> Deploy a project using Lets through git push

Basically all this plugin does is executing
`git push <remote> <branch>[:<remoteBranch>]` in a controlled and structured
fashion.

## Installation

This plugin requires [Lets](https://github.com/letsjs/lets). If you haven't
used Lets before you better head over there and read up on how to install it and
get started. To use lets-git-push:

```bash
$ npm install lets-git-push
```

## Example

**Letsfile.js**

```javascript
var gitPull = require('lets-git-pull');

module.exports = function (lets) {
  var production = lets.Stage(),
      staging = lets.Stage();

  production.plugin(gitPull.deploy({
    remote: 'heroku_production',
    branch: 'master'
  }));

  staging.plugin(gitPull.deploy({
    remote: 'heroku_staging',
    branch: 'develop',
    remoteBranch: 'master'
  }));

  lets
    .addStage('production', production)
    .addStage('staging', staging);
};
```

## Options

* `remote` (string) name of the remote to push to
* `branch` (string) same as localBranch
* `localBranch` (string) name of the local branch to be pushed
* `[remoteBranch]` (string) name of the remote branch to push to. Falls back to
  localBranch if not set
