---
id: ubuntu-set-timezone
title: "時刻の設定"
sidebar_label: "時刻の設定"
hide_table_of_contents: false
keywords:
  - infra
  - ubuntu
  - timezone
  - settings
---

## 設定

* `ntpupdate` コマンドを使うと一発で設定が終了する。

インストール

```shell
$ apt install ntpdate
```

`ntp` サーバにアクセスして、時刻を問い合わせて同期させる。

```shell
$ ntpdate {server.address or server.name}
```

日本にあわせる例:

```shell
$ ntpdate ntp.nict.jp
```

よく忘れるのでメモ。

---

* 時刻・日付の確認

```shell
# 日付, 時刻の確認
$ date
Mon Jul 12 18:39:27 JST 2021

# カレンダー
$ cal
     July 2021        
Su Mo Tu We Th Fr Sa  
             1  2  3  
 4  5  6  7  8  9 10  
11 12 13 14 15 16 17  
18 19 20 21 22 23 24  
25 26 27 28 29 30 31  
```