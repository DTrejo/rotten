var path = require('path')
var exec = require('child_process').exec
var async = require('async')
var colors = require('colors')
var optimist =
  require('optimist')
    .alias('r', 'repo')
    .default('r', '.')
    .describe('r', 'the repo youd like to examine for rotting code')
    .alias('p', 'prod')
    .default('p', 'master')
    .describe('p', 'the branch you have running in production');
var usage = optimist.usage()
var argv = optimist.argv
var repoDir = path.resolve(__dirname, argv.repo)
var prod = argv.prod;
var repo = require('gift')(repoDir)
var LIMIT = 10

function git(args, cb) {
  return exec('git ' + args, { cwd: repoDir }, cb)
}
function trim (s) { return s.trim() }
function identity (s) { return s }

function main () {
  console.log('Running against ', repoDir.green)
  console.log('Which commits/branches are in production branch', prod.green)
  git('branch -r', function (err, stdout) {
    var branches = stdout.split('\n').map(trim).filter(identity)
    var inprod = [];
    var notinprod = [];
    var partiallyinprod = [];

    async.forEach(branches, function (branch, cb) {
      // git log dt-bsr --not --remotes="*/release" --format="%H | %ae | %ce | %ar | %cr"
      git('log '+ branch +' --not --remotes="*/' + prod + '" --format="%H | %ae | %ce | %ar | %cr"', function (err, stdout) {
        var commits = stdout.split('\n').map(trim).filter(identity).map(function (s) {
          var fields = s.split(' | ')
          return {
            sha: fields[0]
          , author: fields[1]
          , comitter: fields[2]
          , authordate: fields[3]
          , comitterdate: fields[4]
          }
        })
        if (commits.length === 0) {
          inprod.push({ branch: branch, commits: commits })
        }
        // else if (commits.length !== commitsInBranch) {
        //   // TODO partially in master, warn
        // }
        else {
          notinprod.push({ branch: branch, commits: commits })
        }
        cb()
      })
    }, function (err) {
      inprod.forEach(function (info) {
        console.log(info.branch.green, 'all in prod, please delete remote branch')
      })
      console.log("==Paste the following to delete them all==".red)
      var deleteThese = inprod.map(function (info) {
        return 'git push origin :' + info.branch.red
      }).join('; ')
      console.log(deleteThese)
      console.log()
      console.log()

      // partiallyinprod.forEach(function (info) {
      //   console.log(info.branch.yellow, 'has', info.numincluded, '/', info.numtotal, 'commits in prod');
      // })
      console.log('==Branches waiting to get into prod (or plain rotten)=='.red);
      notinprod.sort(function (a, b) {
        return b.commits.length - a.commits.length
      })
      notinprod.forEach(function (info) {
        var latest = info.commits[0];
        console.log('  ' + ('' + info.commits.length).red + ' ' + info.branch.red
          + ' has ' + (info.commits.length + '').red
          + ' waiting. Latest commit: Author %s, %s. Comitter %s, %s.'
          , latest.author, latest.authordate, latest.comitter, latest.comitterdate)
      })
    })
  })
}

if (require.main === module) {
  main()
}
