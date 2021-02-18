---
id: git-multiUser
title: "Git で複数ユーザを使い分ける"
sidebar_label: "Git で複数ユーザを使い分ける"
slug: git/multiUser/
hide_table_of_contents: false
keywords:
  - git
  - github
  - gitlab
---

<!-- date: 2020-10-14T09:38:49+09:00 -->

## Motivation

個人用と、アルバイト用で異なる git アカウントを使い分けたい。その切り替え方法の覚書。

* 個人アカウントは global として登録 (メインアカウント)
* アルバイト先のプロジェクトでは local の設定で、アカウント情報を上書きする (サブアカとして上書き)

という方法で改善を試みた。

## global なアカウントを設定する

自分がよく使うメインアカウントは、global に設定する。

グローバル設定は `~/.gitconfig` に登録される。

逆に、グローバル設定にしたいことがある場合、このファイルに書けば良い、ということ。

### ~/.gitconfig にアカウントを設定

```sh
git config --global user.name "{main-user-name}"
git config --global user.email "{main-user-email@example.com}"
```

`{main-user-name}`, `{main-user-email@example.com}` の部分は、ご自身のアカウントに合うように書き換えてください m(_ _)m

### 設定内容を確認

以下を実行してファイルの中身をチェックします。

```
cat ~/.gitconfig | grep user -A 2
```

だいたいこうなっていれば OK.

<!-- ~/.gitconfig -->
```
[user]
	name = {main-user-name}
	email = {main-user-email@example.com}
```


## local アカウントの設定

ここまでで行なったグローバル設定は「使用している PC (の自分のアカウント) 全体に対するデフォルト設定」のようなもの。

ローカル設定は、およそ「リポジトリ毎」に登録 (上書き) できる設定だと思えば良さそう。

リポジトリの下で設定のコマンドを打つので、まずはそこまで移動。

```
cd projects/path/to/your/repository
git config --local user.name "{sub-user-name}"
git config --local user.email "{sub-user-email@example.com}"
```

ここでも同じく `{sub-user-name}`, `{sub-user-email@example.com}` の方はご自身に合わせて書き換えてください。


### 設定の確認

`--local` に設定した内容は、リポジトリ内の `.git/config` に設定される。
ここを覗いて確認してみる。

```sh
cat .git/config
```

以下のような部分があれば OK です。

```.git/config
[user]
	name = {sub-user-name}
	email = {sub-user-email@example.com}
```



## 実行後の確認

設定ファイルをみる限りでは、確認できましたが、
一応 (push などする前に) 手元で「自分が望んだ設定になっているか」確認をしておくと無難だと思います。

```sh
git log
```

```
commit XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
Author: user-name <email@example.com>  # <= ここで確認できる
Date:   Xxx Xxx 00 00:00:00 2016 +0000

    add: add 内容
```

こんな感じで、「どのアカウントを使っているか」を見ることができます。

もし違ったら、`git reset` などで戻せるかと思います...


## 参考
* [複数のgitアカウントを使い分ける](https://qiita.com/0084ken/items/f4a8b0fbff135a987fea)
