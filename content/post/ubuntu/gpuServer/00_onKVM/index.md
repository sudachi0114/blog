---
title: "KVM GPU PathThrough 設定"
date: 2020-09-23T13:12:56+09:00
draft: false
weight: 1
---

Host となる Ubuntu server 上に KVM を立てて、この環境で GPGPU 学習環境 (server) を構築します。

このとき、もともと Host が持っている GPU の制御を KVM 側に渡してあげる必要があるのですが、やり方が結構難しく、たくさんつまづいたのでノートをつけました。

## 前提
0. BIOS (UEFI) で intel VT-d が ON になっている。

(AMD の CPU を使っている場合は、 AMD-V (SVM?) が有効 (ON) になっていれば OK だと思います (たぶん) )

---

## 設定
 
### 1. grub に (intel) iommu 有効化の設定を追記する。

* 編集先の確認: `ls /etc/default/grub`
```sh
/etc/default/grub
```

* (一応) バックアップを取っておきます。
```sh
cp /etc/default/grub /etc/default/grub.orig
```


* 編集します。
    - `emacs /etc/default/grub ` (など) で以下の内容を追記します。

```grub
# GRUB_CMDLINE_LINUX : 追記 (AMD CPU の場合は [amd_iommu=on])
GRUB_CMDLINE_LINUX="intel_iommu=on"
```


* 変更が完了したら grub の設定を適用 (更新) します。
    - `grub-mkconfig -o /boot/grub/grub.cfg`

実行例を貼っておきます。
```console
Sourcing file `/etc/default/grub'
Generating grub configuration file ...
Linux イメージを見つけました: /boot/vmlinuz-5.0.0-27-generic
Found initrd image: /boot/initrd.img-5.0.0-27-generic
Linux イメージを見つけました: /boot/vmlinuz-5.0.0-23-generic
Found initrd image: /boot/initrd.img-5.0.0-23-generic
Adding boot menu entry for EFI firmware configuration
完了
```


### 2. パススルーを行うために、グラフィックカード (GPU) の PCI識別番号と [ベンダーID:デバイスID] を調べる

- PCI識別番号 => 以下では `01:00.X` がそれに当たる。
- venderID:deviceID => 以下では `[10de:***]`

```terminal
$ lspci -nnk

...
01:00.0 VGA compatible controller [0300]: NVIDIA Corporation Device [10de:1e84] (rev a1)
	Subsystem: NVIDIA Corporation Device [10de:139f]
	Kernel modules: nvidiafb, nouveau
01:00.1 Audio device [0403]: NVIDIA Corporation Device [10de:10f8] (rev a1)
	Subsystem: NVIDIA Corporation Device [10de:139f]
	Kernel driver in use: snd_hda_intel
	Kernel modules: snd_hda_intel
01:00.2 USB controller [0c03]: NVIDIA Corporation Device [10de:1ad8] (rev a1)
	Subsystem: NVIDIA Corporation Device [10de:139f]
	Kernel driver in use: xhci_hcd
01:00.3 Serial bus controller [0c80]: NVIDIA Corporation Device [10de:1ad9] (rev a1)
	Subsystem: NVIDIA Corporation Device [10de:139f]
	Kernel driver in use: nvidia-gpu
	Kernel modules: i2c_nvidia_gpu
04:00.0 Ethernet controller [0200]: Realtek Semiconductor Co., Ltd. RTL8111/8168/8411 PCI Express Gigabit Ethernet Controller [10ec:8168] (rev 15)
	Subsystem: ASUSTeK Computer Inc. RTL8111/8168/8411 PCI Express Gigabit Ethernet Controller [1043:8677]
	Kernel driver in use: r8169
	Kernel modules: r8169
```


#### 2.1. `/etc/modprobe.d/vfio.conf` に PathThrough の設定を記述する。

* 確認

```terminal
$ ls /etc/modprobe.d/vfio.conf 
ls: '/etc/modprobe.d/vfio.conf' にアクセスできません: そのようなファイルやディレクトリはありません    
```

* ない場合は新規作成。
    - `# emacs /etc/modprobe.d/vfio.conf`
    
```/etc/modprobe.d/vifo.conf
options vfio-pci ids=10de:1e84,10de:10f8,10de:1ad8,10de:1ad9
```


#### 2.2 作成 (変更) した vfio-pci.conf を モジュールにロードさせる。

* もともとないみたいなので追加しているだけ (のようです..)
```terminal
# ls /etc/modules-load.d/`
cups-filters.conf  modules.conf

# echo 'vfio-pci' > /etc/modules-load.d/vfio-pci.conf
```

* 増えました
```terminal
# ls /etc/modules-load.d/
cups-filters.conf  modules.conf  vfio-pci.conf

# cat /etc/modules-load.d/vfio-pci.conf 
vfio-pci
```

* **ここまで来たら一旦 reboot します**


#### 2.3 再起動後、dmesg を確認します (長いので検索する)

* IOMMU enable になっていればひとまず OK です。
    
```terminal
$ dmesg | grep -E "DMAR|IOMMU"
[    0.007164] ACPI: DMAR 0x0000000079E4B348 0000A8 (v01 INTEL  EDK2     00000002      01000013)
[    0.152653] DMAR: IOMMU enabled
[    0.222966] DMAR: Host address width 39
[    0.222967] DMAR: DRHD base: 0x000000fed90000 flags: 0x0
[    0.222971] DMAR: dmar0: reg_base_addr fed90000 ver 1:0 cap 1c0000c40660462 ecap 19e2ff0505e
[    0.222971] DMAR: DRHD base: 0x000000fed91000 flags: 0x1
[    0.222974] DMAR: dmar1: reg_base_addr fed91000 ver 1:0 cap d2008c40660462 ecap f050da
[    0.222974] DMAR: RMRR base: 0x00000078d8b000 end: 0x00000078daafff
[    0.222975] DMAR: RMRR base: 0x0000007b800000 end: 0x0000007fffffff
[    0.222976] DMAR-IR: IOAPIC id 2 under DRHD base  0xfed91000 IOMMU 1
[    0.222976] DMAR-IR: HPET id 0 under DRHD base 0xfed91000
[    0.222977] DMAR-IR: Queued invalidation will be enabled to support x2apic and Intr-remapping.
[    0.224629] DMAR-IR: Enabled IRQ remapping in x2apic mode
[    1.075801] DMAR: No ATSR found
[    1.075829] DMAR: dmar0: Using Queued invalidation
[    1.075831] DMAR: dmar1: Using Queued invalidation
[    1.075842] DMAR: Setting RMRR:
[    1.075877] DMAR: Setting identity map for device 0000:00:02.0 [0x7b800000 - 0x7fffffff]
[    1.075912] DMAR: Setting identity map for device 0000:00:14.0 [0x78d8b000 - 0x78daafff]
[    1.075916] DMAR: Prepare 0-16MiB unity mapping for LPC
[    1.075944] DMAR: Setting identity map for device 0000:00:1f.0 [0x0 - 0xffffff]
[    1.075950] DMAR: Intel(R) Virtualization Technology for Directed I/O
```


#### 2.4 続いて vfio も有効になっていることを確認

```terminal
$ dmesg | grep -i vfio 
[    1.410454] VFIO - User Level meta-driver version: 0.3
[    7.357963] vfio-pci 0000:01:00.0: vgaarb: changed VGA decodes: olddecodes=io+mem,decodes=io+mem:owns=none
[    7.374971] vfio_pci: add [10de:1e84[ffffffff:ffffffff]] class 0x000000/00000000
[    7.394981] vfio_pci: add [10de:10f8[ffffffff:ffffffff]] class 0x000000/00000000
[    7.394984] vfio_pci: add [10de:1ad8[ffffffff:ffffffff]] class 0x000000/00000000
[    7.394985] vfio_pci: add [10de:1ad9[ffffffff:ffffffff]] class 0x000000/00000000    
```

#### 2.5 基本的にはここまでで、KVM に GPU PathThrough ができるはず.. なのですが...
    
* 標準で読み込まれているドライバがあるときはその認識を外して vfio に制御を渡す必要があるようです。 (手動で)

* 以下では、`01:00.2` と `01:00.3` の ドライバが `vfio-pci` ではなくそれぞれ `xhci_hcd` / `nvidia-gpu` を使っているようです。これを `vfio-pci` を使うように変更します。

`Kernel driver in use: XXX` の部分です。

```terminal
01:00.0 VGA compatible controller [0300]: NVIDIA Corporation Device [10de:1e84] (rev a1)
	Subsystem: NVIDIA Corporation Device [10de:139f]
	Kernel driver in use: vfio-pci
	Kernel modules: nvidiafb, nouveau
01:00.1 Audio device [0403]: NVIDIA Corporation Device [10de:10f8] (rev a1)
	Subsystem: NVIDIA Corporation Device [10de:139f]
	Kernel driver in use: vfio-pci
	Kernel modules: snd_hda_intel
01:00.2 USB controller [0c03]: NVIDIA Corporation Device [10de:1ad8] (rev a1)
	Subsystem: NVIDIA Corporation Device [10de:139f]
	Kernel driver in use: xhci_hcd
01:00.3 Serial bus controller [0c80]: NVIDIA Corporation Device [10de:1ad9] (rev a1)
	Subsystem: NVIDIA Corporation Device [10de:139f]
	Kernel driver in use: nvidia-gpu
	Kernel modules: i2c_nvidia_gpu
04:00.0 Ethernet controller [0200]: Realtek Semiconductor Co., Ltd. RTL8111/8168/8411 PCI Express Gigabit Ethernet Controller [10ec:8168] (rev 15)
	Subsystem: ASUSTeK Computer Inc. RTL8111/8168/8411 PCI Express Gigabit Ethernet Controller [1043:8677]
	Kernel driver in use: r8169
	Kernel modules: r8169
```


* ちなみに、このような状態で、KVM に GPU PathThrough しようとすると

```sh
$ virt-install \
--name ubuntu1804 \
--ram 8192 \
--disk path=/var/kvm/images/ubuntu1804.img,size=30 \
--vcpus 4 \
--os-type linux \
--os-variant ubuntu18.04 \
--network bridge=br0 \
--graphics none \
--console pty,target_type=serial \
--location 'http://jp.archive.ubuntu.com/ubuntu/dists/bionic/main/installer-amd64/' \
--extra-args 'console=ttyS0,115200n8 serial' \
--host-device 01:00.0 \
--features kvm_hidden=on \
--machine q35

Starting install...
Retrieving file linux...                                                                                                                                                             | 7.9 MB  00:00:00     
Retrieving file initrd.gz...                                                                                                                                                         |  45 MB  00:00:01     
Allocating 'ubuntu1804.img'                                                                                                                                                          |  30 GB  00:00:00     

ERROR    internal error: qemu unexpectedly closed the monitor: 2019-09-09T14:14:20.277464Z qemu-system-x86_64: -device vfio-pci,host=01:00.0,id=hostdev0,bus=pci.3,addr=0x0: vfio error: 0000:01:00.0: group 1 is not viable
Please ensure all devices within the iommu_group are bound to their vfio bus driver.
Removing disk 'ubuntu1804.img'                                                                                                                                                       |    0 B  00:00:00     
Domain installation does not appear to have been successful.
If it was, you can restart your domain by running:
	virsh --connect qemu:///system start ubuntu1804
otherwise, please restart your installation.
```

* 上記のように `group 1 is not viable` というエラーを言い渡されます。


##### 2.5.1 このような場合は以下を root で実行します

(本当は、今回の場合だと 01:00.2 と 01:00.3 だけでいいのですが、ケースバイケースにすると、長くなるので、一括で変更してしまっています。簡単にいうと「横着」です。)

```sh
# echo たち (全部入り)

echo 10de [ここを] > /sys/bus/pci/drivers/vfio-pci/new_id
echo 10de [上で調べた] > /sys/bus/pci/drivers/vfio-pci/new_id
echo 10de [deviceIdに] > /sys/bus/pci/drivers/vfio-pci/new_id
echo 10de [変える] > /sys/bus/pci/drivers/vfio-pci/new_id
```


* 例 (今回の場合) 
```sh
echo 10de 1f02 > /sys/bus/pci/drivers/vfio-pci/new_id
echo 10de 10f9 > /sys/bus/pci/drivers/vfio-pci/new_id
echo 10de 1ada > /sys/bus/pci/drivers/vfio-pci/new_id
echo 10de 1adb > /sys/bus/pci/drivers/vfio-pci/new_id
```

* 実行です

```sh
echo 0000:01:00.0 > /sys/bus/pci/devices/0000:01:00.0/driver/unbind
echo 0000:01:00.1 > /sys/bus/pci/devices/0000:01:00.1/driver/unbind
echo 0000:01:00.2 > /sys/bus/pci/devices/0000:01:00.2/driver/unbind
echo 0000:01:00.3 > /sys/bus/pci/devices/0000:01:00.3/driver/unbind

echo 0000:01:00.0 > /sys/bus/pci/drivers/vfio-pci/bind
echo 0000:01:00.1 > /sys/bus/pci/drivers/vfio-pci/bind
echo 0000:01:00.2 > /sys/bus/pci/drivers/vfio-pci/bind
echo 0000:01:00.3 > /sys/bus/pci/drivers/vfio-pci/bind
```


* 補足ですが、Host マシンを reboot したりする度に、ドライバは初期設定のものに戻るので、再起動や停止などをしたら、いちいちスクリプトを実行しなければなりません。



### 3. ここからが本当の問題です...

* ここまでやって `virt-install` すると

```sh
$ virt-install \
--name ubuntu1804 \
--ram 8192 \
--disk path=/var/kvm/images/ubuntu1804.img,size=30 \
--vcpus 4 \
--os-type linux \
--os-variant ubuntu18.04 \
--network bridge=br0 \
--graphics none \
--console pty,target_type=serial \
--location 'http://jp.archive.ubuntu.com/ubuntu/dists/bionic/main/installer-amd64/' \
--extra-args 'console=ttyS0,115200n8 serial' \
--host-device 01:00.0 \
--features kvm_hidden=on \
--machine q35

Starting install...
Retrieving file linux...                                                                                                                                                             | 7.9 MB  00:00:00     
Retrieving file initrd.gz...                                                                                                                                                         |  45 MB  00:00:01     
Allocating 'ubuntu1804.img'                                                                                                                                                          |  30 GB  00:00:00     
Connected to domain ubuntu1804
Escape character is ^]
```

と、このままインストールに進みそうなのに、ここで止まるという問題が起こってしまいます (未解決)



#### 3.1 部分的な解決方法ですが VNC 経由 (かつ iso イメージを local に用意する) という方法で現状 GPU 認識 VM を作成することができ"ている"

* ちなみに、ここでとまってしまった VM は、`running` にはなるのですが、OS が入っていないという無用の長物で、shutdown の命令が届かないため、ぶっ壊すしかない..


* 確認: `$ virsh list --all`
* デストロイ (強制終了): `$ virsh destroy [domain名]`
* ディスクと仮想マシンの除去: `$ virsh undefine [domain名] --remove-all-storage`


#### 3.2 以下、部分的解決策での VM 作成方法を書きます

* `/var/kvm/` 下に iso の置き場所を作り、iso イメージをダウンロードします。

```sh
mkdir /var/kvm/iso
cd /var/kvm/iso
wget http://releases.ubuntu.com/18.04.3/ubuntu-18.04.3-live-server-amd64.iso
```

* **注意 2019/09/09 時点での最新版です。**

* VM の名前を変数に格納しておくと便利でしょう。
```
servername=suzukvm

# いちおう、確認までしておきます
echo $servername
suzukvm
```

* VM の作成
```sh
$ virt-install \
--name ${servername} \
--ram 4096 \
--disk path=/var/kvm/images/${servername}.img,size=60 \
--vcpus 2 \
--os-type linux \
--os-variant ubuntu18.04 \
--network bridge=br0 \
--graphics vnc,port=5901,listen=0.0.0.0,keymap=ja,password=vnc \
--noautoconsole \
--console pty,target_type=serial \
--cdrom=/var/kvm/iso/ubuntu-18.04.3-live-server-amd64.iso \
--host-device 01:00.0 \
--features kvm_hidden=on \
--machine q35
```

* 実行結果の例を以下に書いておきます。
```
Starting install...
Allocating 'suzukvm.img'                                                      |  60 GB  00:00:00     
    Domain installation still in progress. You can reconnect to 
    the console to complete the installation process.
```


#### 3.3 こんな感じでコンソールが帰ってきたら、VNC でつなぐ。

* mac user の方は finder 右クリックで「サーバヘ接続」 -> `vnc://[ip address]:5901` とすると、接続できます。(ssh portforwarding なども可能です)

* ubuntu (linux) user の方は Remmina というのがあるらしい..
    - http://sebarabara.com/mint_remmina/
        + もちろん、他にもあるらしいですが..私は remmina で成功したので、共有までです。

* firewall を有効化している場合は 5901 (指定した) ポートを許可するようにしていしておきましょう。


##### 3.3.1 以下 remmina を用いて VNC 接続することでの VM 作成方法

* コンソールから $ remmina で起動 (接続元の方の PC は Graphic が必要です)
    - **そのコンソール (端末) が使えなくなるので注意!**

    - Remmina の画面が立ち上がる
        + [+] ボタンをクリック (左上??)

    - 以下のように 設定を新規作成します。

        ```
        プロファイル:
            名前 : [自由に設定して良]
            グループ : 指定なし (空欄)
            プロトコル : VNC

        下半分で設定を追加:
            SSH Tunnel:
                [] SSH トンネルを有効にする に check
                    [] ループバック経由のトンネル に check  # 外部のサーバ (ai00X など) に接続する場合は指定しない。

        基本設定:
           サーバー : 127.0.0.1:5901 ( loop back address で指定する場合)
			 : 10.11.222.XXX:5901 (AI Server を指定する場合)
        ```

        + 以上で [保存] をクリック。

* 新規作成した設定が中程に増えていると思うので、それをクリックして接続。
    - 自分のアカウントのパスワードを聞かれるので入力する。

    - 次に VNC のパスワードを聞かれるので vnc (自分で変更したならそのパスワードを) と入力。
        + `このパスワードは virt-install 時に決めている(はずです)。`

    - ubuntu 18.04 server のインストール画面が見える。


#### 3.3.2 installation guide に従って ubuntu server の install を進めていく。

* インストールが終了したら remove install medium で Enter を押します。

    - さっき作った VM が reboot されるので shutoff の状態にして getty を設定しましょう。
	
```
virsh stop $(servername)
```

#### 3.3.3 getty の設定

以下の3行を流して設定終了です。

```
guestmount -d ${servername} -i /mnt
ln -s /mnt/lib/systemd/system/getty@.service /mnt/etc/systemd/system/getty.target.wants/getty@ttyS0.service
umount /mnt
```

* `guestmount: error: you must specify either -i at least one -m option.`
と言われてしまった場合は `$servername` 変数に VM の名前が格納されているかを確認してみると良いと思います。

#### 3.4 VM に入り $ lspci とやって

```
03:00.0 VGA compatible controller: NVIDIA Corporation Device 1e84 (rev a1)
```

このように NVIDIA の VGA が認識されていれば完了です。

お疲れ様でした。


* あとは環境構築マニュアルの手順で行けるはず..です...
    - [fly: 環境構築マニュアル](https://qiita.com/daichildren98/items/ec2f62d49dae7e449570)
