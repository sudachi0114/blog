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

<!-- TODO: 何か別のことを書こうと思ったが忘れた.. 思い出したらまた書く -->


## やり方

```shell
git log {filepath}
```

* ファイルの変更 (diff) をみたい場合は `-p` オプションをつける

```shell
git log -p {filepath}
```

(長くて見辛いので、あまりおすすめはしませんが...)

* commit hash とメッセージだけみたい場合は `--oneline` オプションも効きます。

```shell
git log {filename} --oneline
```


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


## 参考
* [git logでファイルの変更履歴を確認。問題のコミットを特定！](https://www-creators.com/archives/1782)
* [git logで特定ディレクトリのコミット履歴を閲覧する](https://qiita.com/devnokiyo/items/6444c92223aa7e83e93d)
