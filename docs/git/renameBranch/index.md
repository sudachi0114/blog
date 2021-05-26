---
id: git-branch-rename
title: "branch の rename"
sidebar_label: "branch の rename"
hide_table_of_contents: false
keywords:
  - git
  - github
  - gitlab
---

## 本編

```shell
git branch -m {new-branch-name}
```

* 現在あるブランチを指定したい場合

```shell
git branch -m {current-branch-name} {new-branch-name}
```

* 例の配慮

```shell
git branch -m master main
```

### 余談

* `-m` は `--move` の略らしい。

```shell
git branch --move master main
```

### git init したときのデフォルトブランチの名前を変更する

* `~/.gitconfig` (global なやつ) に設定する

```shell
git config --global init.defaultBranch main
```

* `git init` ときにもデフォルトのブランチ名を指定できるらしい。

```shell
git init --initial-branch main
```


## 参考
* [gitのローカルのブランチ名を変更したい](https://qiita.com/suin/items/96c110b218d919168d64)
* [Gitのデフォルト・ブランチ名を変更する方法](https://parashuto.com/rriver/tools/change-git-default-branch-name)
