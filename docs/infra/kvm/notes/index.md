---
id: infra-kvm-notes
title: "KVM に関するメモ"
sidebar_label: "メモ"
hide_table_of_contents: false
keywords:
  - infra
  - kvm
---


## オプションなど

* [KVM : 仮想マシン作成#1](https://www.server-world.info/query?os=Ubuntu_18.04&p=kvm&f=2)


## os-variant 一覧

```shell
$ apt install virtinst      # ← virt-installコマンドを使うからいれました。
$ apt install libosinfo-bin # ← osinfo-queryコマンドを使うために必要となります。

$ osinfo-query os           # ← os-variant option で選べる OS のリストはこちらのコマンドで表示できます。
```

* [virt-install os-variantの一覧](https://qiita.com/ajitama/items/9be0513e2380a8c2ad04)


## ボリューム操作

* [LVMで 論理ボリュームの作成、拡張、縮小、複製](https://qiita.com/TsutomuNakamura/items/93c6333c8dd32aeb197a)