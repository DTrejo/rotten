var exec = require('child_process').exec
var async = require('async')
var optimist =
  require('optimist')
    .alias('p', 'prod')
    .default('p', 'master')
    .alias('p', 'the branch you have running in production');
var usage = optimist.usage();
var argv = optimist.argv

function git(args, cb) {
  return exec('git', args, cb)
}

if (require.main === module) {
  var tasks = [
    async.apply(git, "branch -r")
  , function (err, stdout) {
      if (err) throw new Error(err.message)
      console.log(stdout)
    }
  ]
  async.series(tasks, function (err) {
    if (err) throw new Error(err.message)
    console.log('===')
  });
}
