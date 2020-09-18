---
title: "02_deploy"
date: 2020-09-18T17:25:12+09:00
draft: false
weights: 2
---

## Netlify に deploy する方法

せっかく blog を作ったので、公開したいですよね。私はしたいです。

今回は、`Netlify` にアップロード (デプロイ) することにしました。

理由としては、主に以下の通りです。

* Netlify が公式に Hugo を推奨している
* Help (Qiita や、他の方のブログ記事) が豊富

技術選定などをするにあたって、これらの観点は私もよく考える点ですね。

### 0. GitHub に登録しよう
まずは、GitHub にリポジトリとして登録しましょう。

Netlify は、 GitHub の (指定の branch の) 変更を見て、デプロイしたサイトの更新をしてくれます。
これにより、 CD (Continus Delevery) 環境を作ることができます。嬉しいですね。


### 1. 設定ファイルを作成

設定は `my-blog/netlify.toml` (プロジェクト直下) に作成します。

基本的には [Hugo 公式の Netlify deploy サポートページ](https://gohugo.io/hosting-and-deployment/hosting-on-netlify/#configure-hugo-version-in-netlify) にテンプレがあるので、これを利用します。

主に変えるところは (私が変えたところ) は、以下の2点です。

1. hugo のバージョン
2. build 時のコマンドに theme を追加

変更後のものを貼っておきます。

```netlify.toml
[build]
publish = "public"
command = "hugo --theme=learn --gc --minify"

[context.production.environment]
HUGO_VERSION = "0.74.3"
HUGO_ENV = "production"
HUGO_ENABLEGITINFO = "true"

[context.split1]
command = "hugo --gc --minify --enableGitInfo"

[context.split1.environment]
HUGO_VERSION = "0.74.3"
HUGO_ENV = "production"

[context.deploy-preview]
command = "hugo --gc --minify --buildFuture -b $DEPLOY_PRIME_URL"

[context.deploy-preview.environment]
HUGO_VERSION = "0.74.3"

[context.branch-deploy]
command = "hugo --gc --minify -b $DEPLOY_PRIME_URL"

[context.branch-deploy.environment]
HUGO_VERSION = "0.74.3"

[context.next.environment]
HUGO_ENABLEGITINFO = "true"
```

* hugo のバージョンに関しては `hugo version` によって知ることができます

例: 私の環境
```
$ hugo version
Hugo Static Site Generator v0.74.3/extended darwin/amd64 BuildDate: unknown
```

`v0.74.3` の部分ですね。
Hugo のテンプレを見て、数字の部分だけ (`v` とか `/extended` とかは除きました) にしました。

4箇所 (くらい, たぶん) あるので、変更してきます。(なんとか 1つ変更するだけで良くならないかなあ...)


* 次に `theme` に関してですが

```netlify.toml
[build]
publish = "public"
command = "hugo --theme=learn --gc --minify"
```

この部分の `command` で指定します。

`--theme` のパラメータとして `my-blog/theme/{テーマ名}` に保存した「テーマ名」に基づいた名前を渡しましょう。