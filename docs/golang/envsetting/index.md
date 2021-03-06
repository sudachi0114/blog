---
id: golang-envsetting
title: "[Go] 環境構築"
sidebar_label: "[Go] 環境構築"
hide_table_of_contents: false
keywords:
  - go
  - mac
  - 環境構築
---

# Go 環境構築

Go 言語の開発環境を (macOS 上に) 構築するときの覚え書きと、
その中で得た知見のメモ。

## Install

いろいろ方法がある..

* brew 

```shell
$ brew install go

$ go version
go version go1.15.2 darwin/amd64
```

* goenv
  - github からソースを落としてくるやり方と、brew で入れるやり方があるけど、github から落としてくる方がおすすめ (goenv の公式もそっちを推奨してる)
  - 以下、[ブログ](https://camonowarehouse.hatenablog.jp/entry/2020/10/10/182430) からの移植

---

Homebrew でもインストールできるのですが、最新版よりかなり遅れたバージョンしか使えないので、私は [公式 github の Installation guide](https://github.com/syndbg/goenv/blob/master/INSTALL.md)に従う方法をお勧めします。

```shell
# basic github checkout (推奨)
git clone https://github.com/syndbg/goenv.git ~/.goenv

# Homebrew を用いたインストール (非推奨)
brew install goenv
```

「goenv の」PATH を通す。

```shell
echo 'export GOENV_ROOT="$HOME/.goenv"' >> ~/.bashrc
echo 'export PATH="$GOENV_ROOT/bin:$PATH"' >> ~/.bashrc
echo 'eval "$(goenv init -)"' >> ~/.bashrc
exec $SHELL -l
```

「go (関連) の」PATH を通す

```shell
echo 'export GOPATH="${HOME}/go"' >> ~/.bashrc
echo 'export GOBIN="$GOPATH/bin"' >> ~/.bashrc
echo 'export PATH="$GOBIN:$PATH"' >> ~/.bashrc
echo 'export GO111MODULE=on' >> ~/.bashrc
```

(私は PATH を全て `~/.bashrc` で管理しているので、上記のようにしています。)



仮想環境の作成

```shell
# go の version を指定してインストール
goenv install 1.15.2

# local に go の version を設定
goenv local 1.15.2
```

確認

```shell
# 以下 2つが一致しているかをチェック
cat .go-version
go version
```

* [Goの環境構築方法](https://qiita.com/k_shibusawa/items/7c35b083addd2b557f96)
* [MacでGoの環境構築 (brew install go - goen 使わないバージョン) ](https://qiita.com/yukinagae/items/9c20c67003020ef08a8c)
* [goenv global とか](https://blog.bltinc.co.jp/entry/2019/06/27/010812)

* [【Go】goenvを使ってGo1.13.4の環境構築](https://qiita.com/seicode/items/9ffce10086f0646379a1)

* [goenv リポジトリ](https://github.com/syndbg/goenv)

プロジェクト事始め

* [Mac OS X で Golang に入門してみる](https://blog.amedama.jp/entry/2015/10/06/231038)
* [[Go] MacでGo言語環境構築](https://qiita.com/koralle/items/7a16772ad1d2e2e34682)

---

* [公式](https://golang.org/) からインストーラを落としてきてインストールする方法

一番単純なのは `brew` で入れちゃうのだと思う..
個人的には仮想環境でバージョン切り替えて使いたかったので、`goenv` をインストールして使っている。


## 実行方法

以下のような構成を考える。

`go run|build` をするときは、main パッケージの、main 関数が必要 (を探しにいく) だと思っている。

```shell
./helloworld  # <= 作業ディレクトリはここ
└── main.go

0 directories, 1 file
```

```go
// main.go
package main

import (
	"fmt"
)

func main() {
	fmt.Println("Hello world!")
}
```

```shell
# 実行 ($GOPATH に関係なく、以下で実行できるはず)
$ go run main.go
Hello world!

# ビルド ($GOPATH に関係なく、以下で実行できるはず)
$ go build
$ ./helloworld
Hello world!
```

## Go に関する環境変数などの確認

```shell
$ go env
GO111MODULE=""
GOARCH="amd64"
...
```

### この中から大事そうなやつを厳選

たぶんこの辺りだと思う..
(詳細は後々書く..TODO:)

* `GO111MODULE=""`

* `GOBIN=""`

* `GOPATH="/Users/sudachi/go"`
  特にこれについてはいろいろ書きたい..(気がする)

* `GOROOT="/Users/sudachi/.goenv/versions/1.15.2"`


## Go の開発をする場所 (ディレクトリ)

`$GOPATH` のしたじゃないと..とかよく言われてるけど

`go mod init {{ここ}}` 
で頑張れば、基本どこでも OK そう。


## パッケージについて

パッケージ管理ツールとかいろいろあるけど、
最近だと `go mod tidy` が最強だと思う..

### パッケージ分割について

最近のだと相対パスでのインポートはできないよ (たぶん 1.11 系以降はできない)

-> package module という単位で管理する、という話


* 以下のようなプロジェクトを考える。

<!-- go mod って別記事にした方がいいかも.. -->

```
./helloworld
├── algo
│   └── calc.go
├── go.mod
└── main.go

1 directory, 3 files
```

```go
// go.mod 
//  helloworld ディレクトリで $ go mod init しただけ (自分で書いたところはない)
module github.com/sudachi0114/helloworld

go 1.15
```

このとき、`$GOPATH` 配下だと、`go mod init` で自動的に
`$GOPATH/src` 以下から、現在の作業ディレクトリまでのパスが module として認識される。

逆を言えば、`$GOPATH` 配下でなくても `go mod init hoge` とかすれば、
module 名が `hoge` になって、`hoge/algo` で algo パッケージをインポートできるようになる、ということなのです。

以下で別例を与える。

```go
// main.go
package main

import (
	"fmt"

	"github.com/sudachi0114/helloworld/algo"
)

func main() {
	fmt.Println("Hello world!")
	fmt.Println("algo/calc.go: Add(2, 3) = ", algo.Add(2, 3))
	fmt.Println("algo/calc.go: Sub(5, 8) = ", algo.Sub(5, 8))
}
```

```go
// algo/calc.go

package algo

func Add(a int, b int) int {
	return a + b
}

func Sub(a, b int) int {
	return a - b
}
```

:::tip

外部から参照したい関数や変数などは、先頭を大文字にしておく必要がある

:::

### GOPATH 配下でないときの go module

* `GOPATH=$HOME/go` ( = `/Users/sudachi/go` )

以下のプロジェクトはデスクトップ下に作ったので、`$GOPATH` 配下ではない。

```shell
/Users/sudachi/Desktop/helloworld  # デスクトップの下に helloworld がある
├── algo
│   └── calc.go
├── go.mod
└── main.go

1 directory, 3 files
```

* go mod 以下を実行

```shell
# 実行時の作業ディレクトリは /Users/sudachi/Desktop/helloworld
go mod init hoge
```

すると、以下のような `go.mod` ファイルが作成される

```go
// go.mod (これも、自分で書いたわけではない。go mod init hoge すると生成される)
module hoge

go 1.15
```

すると、`/Users/sudachi/Desktop/helloworld` 以下にあるパッケージは `hoge/XXX` という形で参照できる。

```go
// main.go
package main

import (
	"fmt"

	"hoge/algo"  // <= ここの参照の仕方が変わった。
)

func main() {
	fmt.Println("Hello world!")
	fmt.Println("algo/calc.go: Add(2, 3) = ", algo.Add(2, 3))
	fmt.Println("algo/calc.go: Sub(5, 8) = ", algo.Sub(5, 8))
}
```

```go
// algo/calc.go
package algo

func Add(a int, b int) int {
	return a + b
}

func Sub(a, b int) int {
	return a - b
}
```

```shell
$ go run main.go 
Hello world!
algo/calc.go: Add(2, 3) =  5
algo/calc.go: Sub(5, 8) =  -3
```

### modules ができる前の話 (?)

go module ができたのは、どうやら 1.11 以降のようです。

それまでは、相対パスでインポートができてました。以下の例で試してみます。

```shell
# $ rm .go-version

$ goenv install 1.9.7

$ goenv local 1.9.7

$ go version
go version go1.9.7 darwin/amd64
```

このころはまだ `go mod` が使えません。

```shell
$ go mod
go: unknown subcommand "mod"
Run 'go help' for usage.
```

```go
// main.go
package main

import (
	"fmt"

	"./algo"  // <= ここ、相対パスでインポート
)

func main() {
	fmt.Println("Hello world!")
	fmt.Println("algo/calc.go: Add(2, 3) = ", algo.Add(2, 3))
	fmt.Println("algo/calc.go: Sub(5, 8) = ", algo.Sub(5, 8))
}
```

```go
// algo/calc.go
package algo

func Add(a int, b int) int {
	return a + b
}

func Sub(a, b int) int {
	return a - b
}
```

```shell
$ go run main.go 
Hello world!
algo/calc.go: Add(2, 3) =  5
algo/calc.go: Sub(5, 8) =  -3
```

* お掃除

```shell
$ goenv uninstall 1.9.7
```

<!-- 
ちなみに、1.11 以上で相対パスでインポートしようとすると、以下のように怒られます (´・ω・｀)
⬆️ 試しにやってみたら、怒られなかった (´・ω・｀) < なんで??

```shell
# $ goenv local 1.15.2

$ go version
go version go1.15.2 darwin/amd64

$ go run main.go 
build command-line-arguments: cannot find module for path _/Users/sudachi/Desktop/helloworld/algo
```
-->


## 参考
* [The Go Programming Language](https://golang.org/)
* [A Tour of Go](https://go-tour-jp.appspot.com/welcome/1)

* [golang パッケージについてざっくり理解する。(古い方 (go version < 1.11) の書き方なので注意!!)](https://qiita.com/pei0804/items/5f28b42d01fcadb3f765)