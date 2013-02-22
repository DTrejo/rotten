# Rotten — find empty git branches and unmerged ones with tons of code!

    $ npm -g install rotten

## It helps you discover
- Which remote branches are empty (all code is in master), also outputs a command to delete them all.
- Which remote branches still have lots of code that needs to be merged
- How long remote branches have been waiting to be merged.

## Why is this useful?
- discover which projects are languishing
- discover which engineers are unhappy that their code is not being reviewed/merged
- discover how effective your development process is

## How rotten am I really?
Try it out.

```sh
$ npm -g install rotten
$ cd my-big-git-repo
$ rotten
```

# Usage

```
Usage: rotten --repo /path-to-git-repo --prod master

Options:
  -r, --repo         the repo youd like to examine for rotting code                                        [default: "."]
  -p, --prod         the branch you have running in production                                             [default: "master"]
  --keep             don't run "harvested" checks (if you want to keep merged branches)                    [default: false]
  -c, --mostcommits  show branches with the most commits first (defaults to showing oldest commits first)  [default: false]
```

If you'd like to order by most commits waiting (instead of oldest commit waiting):

```sh
$ rotten --mostcommits
```


## Scoring?
`Your rotten score is #rotten:13/harvested:37`

Explanation:

- rotten: number of branches you need to merge into prod
- harvested: branches already in prod that need to be deleted.
