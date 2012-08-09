# Rotten — how rotten is your repo?
- How many branches have how many commits waiting to get into master?
- How much code is **rotting** in remote branches, waiting for release?
- OMG OMG DONT DO THIS PLEASE KEEP YOUR CODE FRESH. RELEASE OFTEN OR DONT CODE!

## How rotten am I really?
Try it out.

```sh
$ npm -g install rotten
$ cd my-big-git-repo
$ rotten
```

## Usage
Simple:

```
$ cd my-big-git-repo
$ rotten
```

Complicated:

```
Usage: rotten --repo /path-to-git-repo --prod master

Options:
  -r, --repo         the repo youd like to examine for rotting code                                        [default: "."]
  -p, --prod         the branch you have running in production                                             [default: "master"]
  -c, --mostcommits  show branches with the most commits first (defaults to showing oldest commits first)  [default: false]
```

If you'd like to order by most commits waiting (instead of oldest commit waiting):

```sh
$ rotten --mostcommits
```


## Scoring?
`Your rotten score is #rotten:13/harvested:37`

Explanation:

  - rotten = # branches you need to merge into prod
  - harvested: branches already in prod that need to be deleted.
