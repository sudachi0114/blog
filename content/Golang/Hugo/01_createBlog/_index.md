---
title: "Hugo ではじめる blog 制作"
date: 2020-09-16T18:29:00+09:00
draft: false
weight: 1
---

## Hello, Hugo!

Hugo でブログを構築しました。

私は txt 形式か、Markdown 形式で技術ノートを取る事が多いのですが、それがそのまま output になってくれればいいのになあ、と思ってました。(激甘え)

現状は、自分用に書いたメモを、わざわざ Qiita や、はてなブログ用に整形して upload してます。
そして、たとえば間違いが見つかったときは、手元のメモを書き直して、記事の対応するところを書き直して...ってしてます。
めっちゃ面倒じゃないですか？私は面倒だなあ、と思っていました。

先日、静的サイトジェネレータで[ポートフォリオを作ってみた](https://sudachi0114.github.io)のですが、同じようにして Markdown で書いた記事をそのまま blog にできるらしく「これだ！」と思って導入 (乗り換え) してみました。

---

## install Hugo

私は個人的に Mac と Ubuntu をよく使うので、以下に例として書いておきます。

* install on Mac by `Homebrew`
```sh
brew install hugo
```

* install on Ubuntu by `apt`
```sh
apt install hugo
```

* (利用者が多いと思われる) Windows でも Chocolatey というパッケージ・マネージャを使う事でインストールできるようですね。
```sh
choco install hugo -confirm
```

他にも [公式ホームページのインストールガイドに](https://gohugo.io/getting-started/installing/) 様々な環境でのインストール方法が書かれているので、必要に応じてご参照ください。

ちなみに `Hugo` は "Go ベースの"「静的サイトジェネレータ」ですが、Go が動作する環境がなくても、バイナリをインストールすれば利用する事ができます。

---

## 自分のブログ (site) を作ろう

まずは、 `hugo new site {your-site-name}` で雛形を作ります。

例:
```sh
hugo new site my-blog
```

上記のコマンドを実行すると、カレントディレクトリ以下に `./my-blog` というディレクトリが作成されます。
中身はおよそ以下の通りです。

```sh
$ tree my-blog
my-blog/
├── archetypes
│   └── default.md
├── config.toml
├── content
├── data
├── layouts
├── static
└── themes

6 directories, 2 files
```

* **Tips: 私はこのブログを `Hugo + GitHub + Netlify` で公開したいので、このタイミングで GitHub に登録しました。**

```sh
git init
git remote add origin https://github.com/{user-name}/{repository-name}.git
git add .
git commit -m "first commit"
git push -u origin master
```


### テーマを決める
[Hugo Themes](https://themes.gohugo.io/) から、お気に入りのテーマを選んでダウンロードします。
ダウンロードは `git submodule` を使うと良いと思います。


私は、[hugo-theme-learn](https://github.com/matcornic/hugo-theme-learn) を使おうと思います。

例:
```sh
cd my-blog
git submodule add https://github.com/matcornic/hugo-theme-learn.git themes/learn
```

`git submodule add {theme の github-repository-リンク} theme/{保存したいテーマ名}` 

という形式で実行すると `my-blog/themes/{保存したいテーマ名}` というディレクトリが作成されたかと思います。
ここにテーマに関するあれやこれやが配置され、ここを読み込むことで、テーマが適用されます。

`git submodule` のすごいところは、この `my-blog/theme/lean` は `GitHub` 上でのシンボリックリンクのようになっていて、ここをたどると、元の theme の github repository に飛べるところなんですよね！
私は、今回初めて使ったので、かなり驚きでした...

<!-- ここに theme/learn のシンボリックリンクになっている画像を入れても良いかも -->


### テーマを使う
ダウンロードしたテーマを適用するには `my-blog/config.toml` の最終行にテーマの定義を追加します。

```my-blog/config.toml
baseURL = "http://example.org/"
languageCode = "en-us"
title = "My New Hugo Site"
theme = "learn"  # <= ここを新しく追加です
```

`theme = {theme/ 下に保存したテーマ名に合わせる}` という風に記載します。


### 確認
テーマの設定を追加したら、サイトの表示を確認してみましょう。

`hugo server` でローカル用のサーバーが立ち上がるので ( たぶん http://localhost:1313 で待ち受け ) サイトの見た目の確認ができます。

<!-- `hugo server -D`, `hugo -D` => `hugo server` ?? -->

コマンドの結果にも URL が表示されるので、そこからアクセスしてみても良いと思います。

<!-- 以下の画像のように表示されれば OK です。 ここに画像をいれる -->

![front-page image](./images/front-page.png?width=30pc)

ちなみにローカルに立ったサーバは `Ctrl-C` で抜けられます。


* **Tips: ここまでで、問題がなければ github にアップしちゃいましょう**

```sh
git add .
git commit -m "なんらかの適切なコメント"
git push origin master
```

<font color="gray">あくまで例です。僕も専用の branch 切ったりしたので、この通りではありません m(_ _)m</font>

---

## エントリの作成

### chapter を作る
`learn` テーマでは、ページを `chapter` (カテゴリ) に所属させることができます。 (chapter に所属させる事ができないテーマもあります。)

chapter の作り方は以下の通りです。参考は [こちら](https://learn.netlify.app/en/cont/archetypes/) です。

```sh
hugo new --kind chapter {chapter_name}/_index.md
```

例: たとえば、この記事は `Golang` と言う chapter に所属しています。
```sh
hugo new --kind chapter Golang/_index.md
```
`_index.md` はその名の通りインデックスなのですが、各ページのコンテンツとして内容を書くこともできます。詳細は後述します。


### 記事を書く
通常の記事は以下のどちらかの方法で作成する事ができます。

```sh
# Either
hugo new {chapter名}/{記事名}/_index.md
# Or
hugo new {chapter名}/{記事名}.md
```

個人的には前者を使う事をおすすめします。(というか、使っています)

理由としては、記事用にディレクトリを切って置くことで image file などを置くこともできるからいいなーと思っているからです。(予定)

あとは `contents/{chapter名}/{記事名}/_index.md` や `contents/{chapter名}/{記事名}.md` を編集する事でコンテンツを置くことができます。