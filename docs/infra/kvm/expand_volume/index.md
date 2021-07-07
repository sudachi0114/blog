---
id: infra-kvm-expand-volume
title: "KVM のボリュームを拡張する"
sidebar_label: "KVM のボリュームを拡張する"
hide_table_of_contents: false
keywords:
  - infra
  - ubuntu
  - kvm
  - volume
---

:::note

KVM で作成したマシンを、シェルで操作している最中に (Tab キーでの補完が効かなくなり)

```
-bash: cannot create temp file for here-document: No space left on device
```

このようなエラーが出てきた場合は、
KVM で立てている VM のディスクがフルであることが原因のことが多いです。

ここで紹介する手順を試してみると、解決することがあります。
:::


## KVM マシンのバックアップ手順

:::warning
**もしもの時のために、ディスクはバックアップをしておきましょう！！**
:::

* 仮想マシンの停止

```shell
$ virsh shutdown {vm-name}
```

* 設定ファイルを出力してバックアップ

```shell
$ virsh dumpxml {vm-name} > /var/kvm/backup/{vm-name}.xml
# など..出力する場所はお好みで
```

* ディスクのバックアップ

```shell
$ cp -p /var/kvm/images/{vm-name}.img /var/kvm/backup/
```

### バックアップした KVM マシンのリストア

* バックアップしたディスク、設定ファイルの適用

```shell
cp -p /var/kvm/backup/{vm-name}.img /var/kvm/images

cp /var/kvm/backup/{vm-name}.xml /etc/libvirt/qemu/
```

* 仮想マシンの定義 → スタート

```shell
$ virsh define /etc/libvirt/qemu/{vm-name}.xml

$ virsh start {vm-name}
```

## Links
