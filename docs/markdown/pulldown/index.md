---
id: markdown-pulldown
title: "markdown: markdown で折りたたみ"
sidebar_label: "markdown: 折りたたみ"
hide_table_of_contents: false
keywords:
  - markdown
  - pulldown
---

<!-- date: ?? -->

# Markdown で折りたたみ

## TL;DR

* 要約として表示したい文章を `<summary>` タグで記載する。
* 追加情報としたい内容を、`<details>` タグで囲む。


---

* **記法と例**

```markdown
`hoge` とは

<details>
<summary>hoge とは、全く意味のない名称であることを示す言葉。</summary>
hoge と似たものに、fuga, piyo, nyan などがある。
残念ながら、hoge の由来について、仮説はいくつかある。しかし、はっきりしていないらしく、調べても1980年代頃から使われ出したということくらいしか分からない。
</details>
```

---

* **表示**

`hoge` とは

<details>
<summary>hoge とは、全く意味のない名称であることを示す言葉。</summary>
hoge と似たものに、fuga, piyo, nyan などがある。
残念ながら、hoge の由来について、仮説はいくつかある。しかし、はっきりしていないらしく、調べても1980年代頃から使われ出したということくらいしか分からない。
</details>

<!-- 

---

折りたたんだ部分で markdown 記法を使いたい場合は、折りたたまれる部分全体を `<div>` で囲うと良いらしい。
ただし `<div>` とコードブロックの間には空白行が一つ以上必要?? 
-->


## 参考
* [Markdown記法 チートシート](https://qiita.com/Qiita/items/c686397e4a0f4f11683d)
* [hoge とは何か](https://qiita.com/hanlio/items/0505c266c114127c6457)