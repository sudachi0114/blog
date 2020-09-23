---
title: "[メモ] 役に立ちそうなこと"
date: 2020-09-17T18:41:34+09:00
draft: false
weight: 3
---

## 記事を書くときに役に立ちそうなこと

---

### chapter に関する tips
* 新しい Chapter を作る
```sh
hugo new --kind chapter {chapter-name}/_index.md
```


#### chapter の header要素
* chapter の header要素 (例)
```
---
title: "Golang"
date: 2020-09-16T18:26:35+09:00
draft: false
chapter: true
pre: "<b>1. </b>"

(ここから chapter の中身)
---
```


* chapter の header の意味
```
---
title: "Golang"                          # <= (string) chapter の名称, 右のスクロール部分にタイトルとして出る"
date: (date?) 2020-09-16T18:26:35+09:00  # <= (date?) chapter を作成した日時, hugo new で作成すると自動的に埋め込まれる
draft: false                             # <= (boolean) 公開するかどうか / この chapter が下書き (準備中) かどうか (false にしないと公開されない, ローカル (サーバ) でも公開されないので注意)
chapter: true                            # <= (boolean) この _index.md が chapter であることを宣言
pre: "<b>1. </b>"                        # <= (string/html) chapter の通し番号 (tex みたいに自動生成にならないかなあ...ちょっと難しそう)
---

(ここから chapter の中身)
```

#### その chapter に属する記事一覧を表示する方法

chapter の _index.md に以下を埋め込むことで、その chapter に含まれる記事の一覧 (list) を配置することができます。

    {{%/* children */%}}


記事内容の説明 (要約? 概要?) がほしい場合は以下のように指定します。

    {{%/* children description="true" */%}} 


また箇条書きの「・」が邪魔だなあ、と思う場合は `div` を指定すれば良さそうです。

    {{%/* children style="div" depth="999" */%}}


公式なドキュメントの内容は以下をご覧ください。
* [参考 (demo)](https://learn.netlify.app/en/shortcodes/children/)
* [参考 (code, RAW を選択するとソースが見られます)](https://github.com/matcornic/hugo-theme-learn/blob/master/exampleSite/content/shortcodes/children/_index.en.md)


---

### エントリに関する tips
* 新しい記事 (エントリ) を作る
```sh
hugo new {chapter}/{path/to/entory}/_index.md
```

例: この記事
```sh
hugo new Golang/Hugo/03_tips/_index.md
# 実際の配置は `content/Golang/Hugo/03_tips/_index.md` ですが
#   hugo new では、自動的に content 下に配置されるので
#   hugo new するときは content を path に含めません。
#   # 含めると、content/content/... となってしまう
```

ちなみに、どのくらい chapter に属させることができるのか？ (どのくらいネストできるのか？) についてですが、めっちゃできそうです。
少なくとも、[公式の demo](https://learn.netlify.app/en/shortcodes/children/) を見る限り 5階層はネストできてるっぽいですね。

![nest chapter](./images/nest_chapter.png?width=30pc)

#### エントリの header要素
* エントリの header要素 (例: この記事)
```
---
title: "[メモ] 役に立ちそうなこと"
date: 2020-09-17T18:41:34+09:00
draft: false
weight: 2
---

(ここから記事の内容)
```


* エントリの header の意味
```
---
title: "[メモ] 役に立ちそうなこと"   # <= (string) この記事のタイトル
date: 2020-09-17T18:41:34+09:00  # <= (date?) エントリを作成した日時, hugo new で作成すると自動的に埋め込まれる
draft: false                     # <= (boolean) 公開するかどうか / このエントリが下書き (準備中) かどうか (false にしないと公開されない, ローカル (サーバ) でも公開されないので注意)
weight: 2                        # <= chapter 中のエントリたちのうち、何番目に表示するか
---

(ここから記事の内容)
```

#### 画像を載せる

```
![image title](path/to/image/file.png)
```

例: Hugo でブログ作った記事の場合

* ディレクトリ構成
```sh
$ tree content/Golang/Hugo/01_createBlog/
content/Golang/Hugo/01_createBlog/
├── _index.md           # <= ここから見た
└── images
    └── front-page.png  # <= このファイルまでの相対パスで指定する

1 directory, 2 files
```

* front-page.png を _index.md に掲載する方法
```
![front-page image](./images/front-page.png)
```
を _index.md 内に書けば OK

画像の大きさを指定したい場合は、ファイル名の後ろに `width` というパラメータで値を指定して、渡せばいいみたいです。
```
![front-page image](./images/front-page.png?width=30pc)
```