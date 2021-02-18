---
id: git-delBranch
title: "Git: branch delete まとめ"
sidebar_label: "Git: branch delete まとめ"
slug: git/delBranch/
hide_table_of_contents: false
keywords:
  - git
  - github
  - gitlab
---

<!-- date: 2020-10-15T18:38:49+09:00 -->


## git での ブランチ削除まとめ

:::warning

**不可逆処理です。実行時はお気をつけください。**

:::

### ローカルリポジトリのブランチを削除する

```shell
git branch -d {branch/name}
```

ちなみに `-d` は `--delete` の短縮系なので、どちらでも OK.

* master に merge してない (master より先に進んでいる) branch を強制的に削除する

```shell
git branch -D {branch/name}
```

`-D` option は `-df`, `--delete --force` と置き換えても OK.


### リモートブランチの削除

```shell
git push --delete {origin} {branch/name}
```

#### リモートブランチの「追跡」を削除する

```shell
git branch -dr {remote/branch/name}
```

`-dr` option は `-d -r` と分けても、`--delete --remotes` と省略せずに書いても OK.

GitHub や GitLab の UI から branch を削除したけど、local ではトラックしているなあ、といったときに使う。

## 参考
* [Gitでローカルブランチ・リモートブランチを削除する方法](https://www-creators.com/archives/1062#_Git-3)
