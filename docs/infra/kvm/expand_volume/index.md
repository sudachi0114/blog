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


---

## 仮想マシンを起動して、増えたボリュームを適用

次に、仮想マシン内での作業になります。

先ほど仮想ディスクのサイズを拡張した KVM を起動し、シェルに接続します。

---

* **使うコマンドはだいたい以下の通りです**
  - `fdisk`
  - `parted`
  - `resize2fs`

---

* 現在のパーティッションの状態を確認

```shell
fdisk -l
```

例:

```shell
$ fdisk -l
Disk /dev/vda: 60 GiB, 64424509440 bytes, 125829120 sectors  # <= 全部で 60G ありますが
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: dos
Disk identifier: 0x903e0dcb

Device     Boot Start      End  Sectors Size Id Type
/dev/vda1  *     2048 62912511 62910464  30G 83 Linux  # <= メインのパーティションでは 30G のままです。これを増やします。
```

---

もし、ここで

```shell
GPT PMBR size mismatch (250069679 != 976773167) will be corrected by write.
```

などの警告が出ている場合は、`parted -l` を実行すると、エラーが解消されるようです。
(以下、参考元より引用)

```shell
$ parted -l
Error: The backup GPT table is corrupt, but the primary appears OK, so that will
be used.
OK/Cancel? OK  # <= 入力

Warning: Not all of the space available to /dev/sda appears to be used, you can fix the GPT to use all of the space (an
extra 726703488 blocks) or continue with the current setting?
Fix/Ignore? Fix  # <= 入力

Model: ATA WDC WDS500G2B0A (scsi)
Disk /dev/sda: 500GB
Sector size (logical/physical): 512B/512B
Partition Table: gpt
Disk Flags:

Number  Start   End     Size    File system  Name  Flags
 1      1049kB  2097kB  1049kB                     bios_grub
 2      2097kB  128GB   128GB   ext4
```

再び `fdisk -l` を行い、警告が出なくなって入れば OK です。

---

### パーティションを拡張

```shell
fdisk /dev/vda
```

`vdaN (N は数字)` というのもありますが、ここで編集するのは数字なしの `/dev/vda` です。

例

```shell
$ fdisk /dev/vda

Welcome to fdisk (util-linux 2.31.1).
Changes will remain in memory only, until you decide to write them.
Be careful before using the write command.


Command (m for help): p  # <= パーティションテーブルの表示
Disk /dev/vda: 60 GiB, 64424509440 bytes, 125829120 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: dos
Disk identifier: 0x903e0dcb

Device     Boot Start      End  Sectors Size Id Type
/dev/vda1  *     2048 62912511 62910464  30G 83 Linux

Command (m for help): d  # <= パーティションを削除
Selected partition 1
Partition 1 has been deleted.

Command (m for help): p  # <= テーブルを表示して確認
Disk /dev/vda: 60 GiB, 64424509440 bytes, 125829120 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: dos
Disk identifier: 0x903e0dcb

Command (m for help): n  # <= パーティションを新しく作成
Partition type
   p   primary (0 primary, 0 extended, 4 free)
   e   extended (container for logical partitions)
Select (default p): p  # primay を選択
Partition number (1-4, default 1): 1
First sector (2048-125829119, default 2048):
Last sector, +sectors or +size{K,M,G,T,P} (2048-125829119, default 125829119):
# この辺はデフォルトで良いと思います (よくわかってない)

Created a new partition 1 of type 'Linux' and of size 60 GiB. # <= 60GB になりました。
Partition #1 contains a ext4 signature.

Do you want to remove the signature? [Y]es/[N]o: y

The signature will be removed by a write command.

Command (m for help): p # 確認のため、もう一度パーティションテーブルを表示
Disk /dev/vda: 60 GiB, 64424509440 bytes, 125829120 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: dos
Disk identifier: 0x903e0dcb

Device     Boot Start       End   Sectors Size Id Type
/dev/vda1        2048 125829119 125827072  60G 83 Linux # <= 良さそう

Filesystem/RAID signature on partition 1 will be wiped.

Command (m for help): w # 変更を write
The partition table has been altered.
Syncing disks.
```

(冗長ですが) ここで確認してみます。
ちゃんと 60G になってます。

```shell
$ fdisk -l
Disk /dev/vda: 60 GiB, 64424509440 bytes, 125829120 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: dos
Disk identifier: 0x903e0dcb

Device     Boot Start       End   Sectors Size Id Type
/dev/vda1        2048 125829119 125827072  60G 83 Linux
```

しかし、`df` で見て見ると、`/dev/vda1` の容量が `30GB` のままのようです。

```shell
$ df -h
Filesystem      Size  Used Avail Use% Mounted on
udev            2.0G     0  2.0G   0% /dev
tmpfs           395M  564K  394M   1% /run
/dev/vda1        30G  4.0G   24G  15% /     # <= この行
tmpfs           2.0G     0  2.0G   0% /dev/shm
tmpfs           5.0M     0  5.0M   0% /run/lock
tmpfs           2.0G     0  2.0G   0% /sys/fs/cgroup
tmpfs           395M     0  395M   0% /run/user/1000
```

ファイルシステムの方には反映されてないみたいなので、反映させます。

```shell
# resize2fs /dev/vda1
resize2fs 1.44.1 (24-Mar-2018)
Filesystem at /dev/vda1 is mounted on /; on-line resizing required
old_desc_blocks = 4, new_desc_blocks = 8
The filesystem on /dev/vda1 is now 15728384 (4k) blocks long.
```

もう一度 `df` を見てみると、`30GB -> 60GB` になっていることがわかります。

```shell
$ df -h
Filesystem      Size  Used Avail Use% Mounted on
udev            2.0G     0  2.0G   0% /dev
tmpfs           395M  564K  394M   1% /run
/dev/vda1        59G  4.0G   53G   8% /  # <= 再びこの行
...
```

これで KVM マシンのボリュームの拡張は無事完了です。


## Links

* [mastodonサーバのSSDを大容量の物に変更しました。（Linuxの大容量SSDへの移行）](https://www.tsukiyono.blue/blog/2020/01/mstdn_maintenance_disk.html)

* [KVMの仮想ディスクを拡張する方法](https://qiita.com/nouphet/items/fea026c03ca86ec54111)
* [fdiskコマンドでパーティション分割](https://qiita.com/r_saiki/items/894de9660607af22ab2e)
