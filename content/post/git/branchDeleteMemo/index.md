---
title: "Git: branch delete まとめ"
date: 2020-10-15T18:38:49+09:00
tags: ["git", "GitHub", "GitLab"]
categories:
  - git
  - github
  - gitlab
---

## git での ブランチ削除まとめ

**不可逆処理です。実行時はお気をつけください。**

### ローカルリポジトリのブランチを削除する

```sh
git branch -d {branch/name}
```

ちなみに `-d` は `--delete` の短縮系なので、どちらでも OK です。

* merge をしてない (master より先に進んでいる) branch を強制的に削除する場合

```sh
git branch -D {branch/name}
```

`-D` option は `-df`, `--delete --force` と置き換えても OK です。




### リモートブランチの削除

```sh
git push --delete {origin} {branch/name}
```

#### リモートブランチの「追跡」を削除する

```sh
git branch -dr {remote/branch/name}
```

`-dr` option は `-d -r` と分けても、`--delete --remotes` と省略せずに書いても OK です。

GitHub や GitLab の UI から branch を削除したけど、local ではトラックしているなあ、といったときに使えると思います。

## 参考
* [Gitでローカルブランチ・リモートブランチを削除する方法](https://www-creators.com/archives/1062#_Git-3)
