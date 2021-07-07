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

---

## ホストPCで仮想ディスクのボリュームを増やす

まずは、ホスト PC での作業になります。
KVM を停止し、仮想ディスクのサイズを拡張します。

```shell
# 仮想マシン内で、シャットダウンするか
$ sudo shutdown now

# ホスト側から停止するか
$ virsh shutdown {vm-name}
```

`{vm-name}.img` の部分はご自身のディスク名に置き換えてください。

また、カレント下になくても、ディスクがある場所へのパスを指定すれば OK です。

ここでは、容量を `30GB` 追加しようと思います。

```shell
# 仮想ディスクの情報を表示 (ここで現在の容量が見られます)
$ qemu-img info /path/to/image/{vm-name}.img

# 仮想ディスクの容量を拡張
$ qemu-img resize {vm-name}.img +30G

# 仮想ディスクの情報を再度表示して確認
$ qemu-img info {vm-name}.img
```

例:

* 状態確認

```shell
$ qemu-img info /var/kvm/images/sample.img
image: /var/kvm/images/sample.img
file format: qcow2
virtual size: 30G (32212254720 bytes)
disk size: 3.7G
cluster_size: 65536
Format specific information:
    compat: 1.1
    lazy refcounts: true
    refcount bits: 16
    corrupt: false
```

* 拡張

```shell
$ qemu-img resize /var/kvm/images/sample.img +30G
Image resized.
```

* チェック

```shell
$ qemu-img info /var/kvm/images/sample.img
image: /var/kvm/images/sample.img
file format: qcow2
virtual size: 60G (64424509440 bytes)  # <= ここが 30G から 60G に増えました。
disk size: 3.7G
cluster_size: 65536
Format specific information:
    compat: 1.1
    lazy refcounts: true
    refcount bits: 16
    corrupt: false
```



## Links
