---
id: git-file-history
title: "1つのファイルの history をみる"
sidebar_label: "1つのファイルの history をみる"
hide_table_of_contents: false
keywords:
  - git
  - github
  - gitlab
---

## やり方

```shell
git log {filepath}
```

* ファイルの変更 (diff) をみたい場合は `-p` オプションをつける

```shell
git log -p {filepath}
```

(長くて見辛いので、あまりおすすめはしませんが...)

### 余談

* あるファイルを、特定のコミットまで戻す

```shell
git checkout {commithash} {filepath}
```

Git バージョン 2.23.0 以降であれば、`restore` が使える

```
git restore --source {commithash} {filepath}

git restore -s {commithash} {filepath}
```

`-s / --source` オプションが必要なことに注意

:::warning
コミットしていない変更は失われるので注意
:::
