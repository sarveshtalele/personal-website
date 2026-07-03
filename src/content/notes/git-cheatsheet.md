---
title: Git cheatsheet
description: Common Git commands for branching, rebasing, and cleaning up history.
pubDate: 2025-07-15
tags: [Git]
---

## Branching

```bash
git switch -c feature/name        # create + switch
git switch main
git branch -d feature/name        # delete merged branch
```

## Staging & committing

```bash
git add -p                        # stage interactively, hunk by hunk
git commit --amend --no-edit      # fix the last commit without changing message
```

## Rebasing

```bash
git rebase -i HEAD~5               # interactive rebase, last 5 commits
git rebase main                    # replay branch on top of main
git rebase --abort                 # bail out
```

## Undoing things

```bash
git restore FILE                   # discard unstaged changes
git restore --staged FILE          # unstage
git reset --soft HEAD~1            # undo last commit, keep changes staged
```

## Inspecting

```bash
git log --oneline --graph --all
git diff --staged
git blame FILE
```
