---
title: かわいい terminal をつくろう
date: 2020-10-30T02:55:45+09:00
draft: false
tags: ["terminal", "macOS", "kawaii"]
categories:
  - terminal
  - macOS
  - kawaii
---

# terminal をかわいくするぞ (固い意思)

## prompt

プロンプトは terminal の入力受付の部分です。

標準だと ↓ こんな感じなのではないでしょうか

```
user@Macbook-Pro:~ $

```

こんな感じ ↓ にしたいと思います。

```
sudachi@DaiMac:~
(*'-') < 

```


## 設定をいじっていきます

私は bash を普段使いしているので `.bashrc` を編集します。

同じ bash でも mac を使っていると `.bash_profile` という設定ファイルで管理している方も
おられるかもしれません。

私は Ubuntu をいじることもあり、「設定は `.bashrc` で全て管理したい」ということから
`.bash_profile` には、「もし `.bashrc` があったら、それを読み込んでね」と**だけ**書いています。

```~/.bash_profile
if [ -f ~/.bashrc ]; then
. ~/.bashrc
fi

```

もちろん、この辺はご自身の好みでいじっていただければと思います。

zsh をお使いの方は `.zshrc` などでしょうし...


* **補足**

本当は、

* `.bash_profile` の方が `.bashrc` より先に読まれる
* `bash_profile` はユーザがログインした時に1回だけ読まれるが、`.bashrc` は bash 起動時に毎回読まれる

などの違いがありますが、mac を普段使いしていて、そんなにたくさん設定を書くことはないですし、
この macbook 使うの、だいたい僕だけだし...と思って、`.bashrc` に書いています。( ~~サボりです。~~ )

さて、前置きが長くなりましたが、プロンプトを変えていきます。


方法としては、`.bashrc` に `PS1` という変数名で、環境変数として設定すれば OK です。


標準ぽいモノを最初にいくつか紹介します (私の好みにより ubuntu like です)

途中に `$(__git_ps1)` という謎の変数が出てきますが、`git init` されているディレクトリでは、カレントブランチをプロンプトの一部に表示するために付けています。

( TODO: この辺もできたら書きます... )

```~/.bashrc
export PS1='\[\033[32m\]\u@\h\[\033[00m\]:\[\033[34m\]\w\[\033[31m\]$(__git_ps1)\[\033[00m\]\$ '

```

実はしばらくは ↑ を少しいじったりして使っていました

ディレクトリをフルパスで表示したい 場合は `\w` の部分を `\W` とすれば出来ますし、
どっかに `\n` を入れると改行できて、fish をお洒落に使いこなされる方の気分になれます(なれません)。


さて、これを**もっとかわいく**しましょう。
復讐になりますが、以下のような感じにしたいのでした。

```
sudachi@DaiMac:~
(*'-') < 

```

こんな感じになりました。**かわいい**

設定の記載だけ先に書きますね。

```~/.bashrc
export PS1='\[\033[32m\]\u@\h\[\033[01m\]:\[\033[34m\]\W\[\033[31m\]$(__git_ps1)\[\033[00m\]\n'"(*'-') < "

```

こんな感じです。

最後の顔のところはシングルコーテーションが入ってしまっているので、
ちょっと理想からは外れますが、ダブルコーテーションで括って繋げました...

ちなみに、処理が正常終了 ( == exit code が 0) か / そうでないか (Error, ここでは、乱暴に exit code 0 以外で決め打ち)でプロンプトを変えることもできます。


```~/.bashrc
export PS1='\[\033[32m\]\u@\h\[\033[01m\]:\[\033[34m\]\W\[\033[31m\]$(__git_ps1)\[\033[00m\]\n'

exitstatus() {
	if [[ $? == 0]]; then
		echo "(*'-') < "
	else
		echo "(*x_x) < "
	fi
}

export PS1=$PS1'$(exitstatus)'

```

なんて ~~めんどうな~~ いや、~~物好きな~~ ことをすると


```
# 前回正常終了
sudachi@DaiMac:~
(*'-') < sl

# 正常終了でない
bash: sl: command not found
sudachi@DaiMac:~
(*x_x) < 

```

という風に分岐できました。**かわいい**。

これの詳しい作り方などは、別エントリーでまとめようと思います...(長くなりそうなので...)


---

## terminal のカラーテーマを変えよう

現状、以下の2択かなぁ...と思っています。
(ドラキュラはあまり好みではありませんでした (-人-) )

1. [Iceberg](http://cocopon.github.io/iceberg.vim/)

参考: [気分転換にTerminal.appの配色を変えてみる？暗青系のテーマ「Iceberg」を移植しました](https://cocopon.me/blog/2014/04/iceberg-for-terminalapp/)


2. [Solarized](https://ethanschoonover.com/solarized/)

参考: [【Mac】ターミナルの配色設定は「Solarized」がおしゃれで見やすくておすすめ](https://reasonable-code.com/solarized/)

( 今は、ダークテーマの Basic をいじって使っています...導入したら追記予定です (-人-) )

---

## terminal app を変えよう

特にこだわりがなければ、mac 標準の `terminal.app` を使えばいいと思います。
ネットの記事では賛否両論ありますが、そんなに不便ではないですし、
コマンドの受け皿 (送り先?) としては十分な機能などは持ていると思います。

ただ、「より良いデザインを！」とか「宗教上の理由で...」という方がいらっしゃいましたら
私の知っている terminal app を2つ紹介します。

* [iTerm2](https://www.iterm2.com/)
  - 私の観測範囲では、そこそこの方が使っている (乗り換えている) イメージがあります。確かに標準のものに比べると、カラーテーマがデフォルトでたくさんご用意してあったり、キーバインドなどいろいろ取り替えられて便利ではあります。私も一時期使ってました。

* [Hyper](https://hyper.is/)
  - Electron ベースのターミナルアプリらしいです。ちょっと使ってみたいけど、まだ手を出したことはありません...


---

## Links

### プロンプトの編集
* [かわいいターミナルのつくりかた - 綺麗に死ぬITエンジニア](https://s8a.jp/how-to-make-a-cute-terminal)

* [実行したコマンドの終了コードを表示する](https://qiita.com/takayuki206/items/f4d0dbb45e5ee2ee698e)

* [Bashのプロンプトに色を付けよう、という話](https://qiita.com/Hiroki_lzh/items/d33184cf5ac9ec92c3a6)
* [Bash/プロンプトのカスタマイズ](https://wiki.archlinux.jp/index.php/Bash/%E3%83%97%E3%83%AD%E3%83%B3%E3%83%97%E3%83%88%E3%81%AE%E3%82%AB%E3%82%B9%E3%82%BF%E3%83%9E%E3%82%A4%E3%82%BA)

* [.bash_profileと.bashrcのまとめ](https://qiita.com/takutoki/items/021b804b9957fe65e093)

* [ターミナルの表示内容(プロンプト)の変更・カスタマイズ方法まとめ](https://qiita.com/hmmrjn/items/60d2a64c9e5bf7c0fe60)
