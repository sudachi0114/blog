---
title: "複数ユーザ"
date: 2020-10-14T09:38:49+09:00
draft: false
tags: ["git"]
---

## Git で複数ユーザを使い分ける

私は現在学生で、大体個人での活動がメインです。

そこで個人的に GitHub のアカウントを持っていて、
普段はそれを使ってソースコードの管理をしています。

ありがたいことに、この度、インターンシップに参加することとなりました。

インターンでは、インターン用の別アカウントを使う必要がありました。

そこで global に登録している個人アカウントはそのままに、
インターンのプロジェクトでは local に git(hub) のアカウントをキャッシュ (登録) する、
ということを行ったので、その方法をメモとして残しておきます。

## global なアカウントを設定する

自分がよく使うアカウントは、global にアカウント情報を設定してしまいましょう。
特に local で設定を書き換えない限り適用される、デフォルト設定みたいなものと思ってもらえればいいと思います。


global に行った設定は `~/.gitconfig` に登録されます。

逆に、global に設定したいことがある場合は、このファイルに書いてあげれば良い、ということです。

### ~/.gitconfig にアカウンティングを設定

```sh
git config --global user.name "{main-user-name}"
git config --global user.email "{main-user-email@example.com}"
```

`{main-user-name}`, `{main-user-email@example.com}` の部分は、ご自身のアカウントに合うように書き換えてください m(_ _)m

### 設定内容を確認

以下を実行してファイルの中身をチェックします。

```
cat ~/.gitconfig
```

以下のような部分があれば OK です。

```~/.gitconfig
[user]
	name = {main-user-name}
	email = {main-user-email@example.com}
```


## local アカウントの設定

先ほどの global な設定は、「使用している PC (の自分のアカウント) 全体に対するデフォルト設定」のようなものです。

local にアカウントを設定すると、「リポジトリ毎」にアカウントを使い分けられます。

この「リポジトリはこのアカウント」という使い方ができるということですね。便利。

まずは、手元にあるリポジトリまで移動しましょう。

```
cd Project/path/to/your/repository
git config --local user.name "{sub-user-name}"
git config --local user.email "{sub-user-email@example.com}"
```

こちらでも同じく `{sub-user-name}`, `{sub-user-email@example.com}` の方はご自身に合わせて書き換えてください。


### 設定の確認

さて、`--local` に設定した内容はどこに登録されるのでしょうか?

リポジトリ内の `.git/config` に設定されます。
覗いてみましょう。

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

設定ファイルを覗くことにより、確認を行いました。

一応、(push などする前に) 手元で「自分が望んだ設定になっているか」確認をしておくと無難だと思います。

```sh
git log
```

を行うと、

```
commit XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
Author: user-name <email@example.com>  # <= ここで確認できます
Date:   Xxx Xxx 00 00:00:00 2016 +0000

    add: add 内容
```

こんな感じで、「どのアカウントを使っているか」を見ることができます。

もし違ったら、`git reset` などで戻せるかと思います...


## 参考
* [複数のgitアカウントを使い分ける](https://qiita.com/0084ken/items/f4a8b0fbff135a987fea)
