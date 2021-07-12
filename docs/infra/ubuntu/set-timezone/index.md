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
