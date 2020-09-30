---
title: "ドライバ インストール編"
date: 2020-09-23T13:13:07+09:00
draft: false
weight: 2
---

# python * AI 環境構築 on Ubuntu 18.04

* 前編 (Driver / Library install 編)
    - [後編はこちら (qiita に飛びます) ](https://qiita.com/daichildren98/items/acc1abcca37dfa521fea)

* author : 鈴木 大智 (user名 : sudachi)
    - pc name : AIserver
* 最終更新 : 2020/09/30

---

## TL;DR
研究室で Ubuntu Server 上に GPGPU 環境を構築する機会がありましたので、その際に行ったことをマニュアル化しました。

私自身、ドキュメントが少なくて困ったことも多々あったので、参考にしていただけますと幸いです。

今回は 前編(Driver / Library install 編)と称しまして、 NVIDIA Driver / CUDA / cuDNN のインストールに関して触れていきます。

基本的にコピペでできるように書いているつもりです。ぜひ利用していただけたらと思います。

## マシンの状態を確認
* (CPU) : `cat /proc/cpuinfo`
* (MEMORY) : `cat /proc/meminfo`
* (VGA) : `lspci | grep VGA`

    - VGA が NVIDIA のものであるか確認する : `lspci | grep NVIDIA`

        + きちんと NVIDIA 製の GPU が認識されていれば以下のような出力が得られる。

```
01:00.0 VGA compatible controller: NVIDIA Corporation Device 1f02 (rev a1)
01:00.1 Audio device: NVIDIA Corporation Device 10f9 (rev a1)
01:00.2 USB controller: NVIDIA Corporation Device 1ada (rev a1)
01:00.3 Serial bus controller [0c80]: NVIDIA Corporation Device 1adb (rev a1)
```


# これから 3つ (4つ) インストールするものがあります。
* NVIDIA Driver : 430.40
* CUDA : 10.0
* cuDNN : 7.6
* tensorflow-gpu : 1.14 (anaconda > python : 3.6)
    - これらはバージョンを合わせないと依存関係が云々、とエラーを言い渡されます。。
    - 私は上記のバージョンでインストールを行ったところうまく行きましたので以下そのバージョンをインストールしていきます。
    - tensorflow もとい, python は anaconda 環境を利用しています。(詳しくは「後編」にて扱います)

## NVIDIA Driver をインストール
* パッケージ管理ツールを最新にします。

```sh
apt update && apt upgrade
```
     
* 好みのエディタがある方はこの辺で入れておくと便利です。
* 以下、私は `emacs` で編集を行いますが、エディタはお好みで。(vimmer の方、石を投げないでください)


* `nouveau` というドライバが動いてないか確認します 
(NVIDIA-Driver と干渉する可能性があるので、動いているようだったら止めます。)
```
lsmod | grep nouveau
```

```
nouveau              1716224  0
mxm_wmi                16384  1 nouveau
wmi                    24576  2 mxm_wmi,nouveau
video                  45056  1 nouveau
i2c_algo_bit           16384  1 nouveau
ttm                   106496  2 cirrus,nouveau
drm_kms_helper        172032  2 cirrus,nouveau
drm                   401408  5 drm_kms_helper,cirrus,ttm,nouveau
```

* このように出力が返ってきて `nouveau` 動いている場合は以下の作業を行います。

1. 編集先を確認します

```
cat /etc/modprobe.d/blacklist.conf
```

2. `nouveau` をブラックリストの末尾に追加

* (心配な方は) デフォルトのブラックリストをバックアップしておくと良いでしょう。

```
cp /etc/modprobe.d/blacklist.conf /etc/modprobe.d/blacklist.conf.orig
```

* blacklist.conf に以下を追記して `nouveau` を無効化します。

```
emacs /etc/modprobe.d/blacklist.conf
```

```/etc/modprobe.d/blacklist.conf
blacklist nouveau
options nouveau modeset=0
```


* (別解) コピペでできる!

```sh
echo '' >> /etc/modprobe.d/blacklist.conf
echo 'blacklist nouveau' >> /etc/modprobe.d/blacklist.conf
echo 'options nouveau modeset=0' >> /etc/modprobe.d/blacklist.conf
```

もし 「 read only 」みたいなエラーで怒られてしまう場合はは root user で編集を行ってください。

```/etc/modprobe.d/blacklist.conf
...
# really needed.
blacklist amd76x_edac

blacklist nouveau
options nouveau modeset=0
```

* こんな感じになったら完了です。忘れず変更を適用しましょう。

```
update-initramfs -u
```

* プロンプトが返ってきたら再起動しましょう

```
reboot
```


* apt のリポジトリに NVIDIA ドライバ のリポジトリを追加

```
add-apt-repository ppa:graphics-drivers/ppa
```

* 途中で「続行するには `Enter` を, 中断するには `Ctrl-C` を押してくれ」と言われるので、続行して良い場合には `Enter` を押します。
    - リポジトリの追加は自己責任でお願いします..

    - apt をアップデート
        + `apt update` 

    - ドライバの推奨バージョンを確認

```
ubuntu-drivers devices
```

ここで以下のように怒られてしまう場合は、`apt install ubuntu-drivers-common` してください。

```
Command 'ubuntu-drivers' not found, but can be installed with:

sudo apt install ubuntu-drivers-common
```



* こんな感じで NVIDIA Driver の推奨バージョンが出力されます。

```
== /sys/devices/pci0000:00/0000:00:02.2/0000:03:00.0 ==
modalias : pci:v000010DEd00001F02sv000019DAsd00002516bc03sc00i00
vendor   : NVIDIA Corporation
driver   : nvidia-driver-430 - third-party free recommended
driver   : nvidia-driver-410 - third-party free
driver   : nvidia-driver-415 - third-party free
driver   : xserver-xorg-video-nouveau - distro free builtin
```

* お好きなバージョンをインストール (概ね最新版でうまくいくと思います..責任は取れないですが..)

    - NVIDIA ドライバのインストールをする。

        + `apt install nvidia-driver-430`

        + 終了したら `reboot`

    - 再びログインしたら、以下のコマンドでインストールされたかを確認できます:
        + `nvidia-smi`

---

[version 追記]

| nvidia-driver  | CUDA  | cuDNN  | data |
| --- | --- | --- | --- |
| 450  | 10.0  | 7.6.5  | 2020/09/12 |
| 440  | 10.2  | 7.6.5 | 2020/02/11 |
| 435  | 10.0  | 7.6.2 | 2019/09/10 |
| 430  | 10.0  | 7.6.2  | 2019/08/06 |

---

## CUDA を install 
* とりあえず、インストールしてみよう。

```
apt-get install cuda-toolkit-10-0
```

```
Reading package lists... Done
Building dependency tree
Reading state information... Done
E: Unable to locate package cuda-toolkit-10-0
```

* apt のリポジトリに CUDA があるかどうかでできるかできないか変わる (のだとと思います)。

* ないと言われた場合は追加します。

    - 認証に必要な鍵を取得

        + `apt-key adv --fetch-keys http://developer.download.nvidia.com/compute/cuda/repos/ubuntu1804/x86_64/7fa2af80.pub`

    - web から CUDA (のインストーラー?) を get  
		(注意: カレントディレクトリの下に入ります)

        + `wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu1804/x86_64/cuda-repo-ubuntu1804_10.0.130-1_amd64.deb`

```
cuda-repo-ubuntu1804_10.1.168-1_amd64.deb
```

があれば OK です。

* パッケージ管理システムに追加

    - `dpkg -i cuda-repo-ubuntu1804_10.0.130-1_amd64.deb`

```
Selecting previously unselected package cuda-repo-ubuntu1804.
(Reading database ... 93960 files and directories currently installed.)
Preparing to unpack cuda-repo-ubuntu1804_10.1.168-1_amd64.deb ...
Unpacking cuda-repo-ubuntu1804 (10.1.168-1) ...
Setting up cuda-repo-ubuntu1804 (10.1.168-1) ...
```

* apt に反映します
    - `apt update`

* CUDA を install します
    - `apt-get install cuda-toolkit-10-0`


* PATH を通す (以下の内容を `.bashrc` などに追記します, 心配な方はバックアップを)。

```
export PATH="/usr/local/cuda/bin:$PATH"
export LD_LIBRARY_PATH="/usr/local/cuda/lib64:$LD_LIBRARY_PATH"
```

* (別解) コピペでできる!

```~/.bashrc
echo '' >> ~/.bashrc
echo 'export PATH="/usr/local/cuda/bin:$PATH"' >> ~/.bashrc
echo 'export LD_LIBRARY_PATH="/usr/local/cuda/lib64:$LD_LIBRARY_PATH"' >> ~/.bashrc
```


- シェルの再起動をする。( `exec $SHELL -l` / `source ~/.bashrc` でも可 )

* 以下のコマンドで CUDA のバージョンと有効化できているかを確認することができます。

    - `nvcc -V`

* 出力の例です。

```
nvcc: NVIDIA (R) Cuda compiler driver
Copyright (c) 2005-2018 NVIDIA Corporation
Built on Sat_Aug_25_21:08:01_CDT_2018
Cuda compilation tools, release 10.0, V10.0.130
```


## cuDNN をインストール

* cuDNN のインストール

cuDNN には

1. Runtime library
2. developer library
3. code samples and user guide

の3つがあります。

* このうち `3.` は画像出力による動作確認のサンプルなので、使いませんので今回はスキップします。
    - ( いま ubuntu-Server を利用しているのでグラフィックスはない、という想定です。)

* 上記 `1.` `2.` をダウンロードします。(ここから 別の PC (ssh 元などあればそちら) での作業になります。)
    - 本当は wget などしてダウンロードしたいのですが、ユーザ認証か何かで弾かれる (403 Forbidden) ので..
    - 手元に何か利用できる PC があればそこにダウンロードします。(PC名 を `DaiMac`, user名を `sudachi` と仮定)
    - 私はそれ scp で Ubuntu Server (ip address を `10.20.30.40` と仮定) に送信する形で解決しました。

        + ここは改善したいところでもあるので、何かいい方法があればご教授いただきたいです..
        + 本当はコンソールからの操作だけで完了させたい.. 

    - [NVIDIA 公式 HP](https://developer.nvidia.com/rdp/cudnn-archive#a-collapse714-9) に必要ならばユーザ登録してください。 (Google account があれば紐付けできます)。
        + 自分の OS と CUDA のバージョンにあった cuDNN library をダウンロードする。
        + (例 : 今回では ubuntu 18.04 / CUDA 10.0)

* Runtime library を Ubuntu Server に送る:
    - `DaiMac:~ sudachi$ scp /Users/sudachi/Downloads/libcudnn7_7.6.2.24-1+cuda10.0_amd64.deb sudachi@10.20.30.40:/home/sudachi/downloads/`

* developer library を Ubuntu Server に送る:
    - `DaiMac:~ sudachi$ scp /Users/sudachi/Downloads/libcudnn7-dev_7.6.2.24-1+cuda10.0_amd64.deb sudachi@10.20.30.40:/home/sudachi/downloads/`

( `rclone` などを使っても良いかと思います)

* (ここから Ubuntu Server での作業に戻ります) パッケージ管理ツールに cuDNN の情報を加える

    - さっき scp で cuDNN library を飛ばした先に移動します。

        + `cd downloads` など
        + 必要なら `ls` などで cuDNN の存在を確認してください。

    - パッケージリストに Runtime Library と Developer Library の両方を反映します。

* `dpkg -i libcudnn7_7.6.2.24-1+cuda10.0_amd64.deb`

```
Selecting previously unselected package libcudnn7.
(Reading database ... 107508 files and directories currently installed.)
Preparing to unpack libcudnn7_7.6.2.24-1+cuda10.0_amd64.deb ...
Unpacking libcudnn7 (7.6.2.24-1+cuda10.0) ...
Setting up libcudnn7 (7.6.2.24-1+cuda10.0) ...
Processing triggers for libc-bin (2.27-3ubuntu1) ...
```

* `dpkg -i libcudnn7-dev_7.6.2.24-1+cuda10.0_amd64.deb`

```
Selecting previously unselected package libcudnn7-dev.
(Reading database ... 107514 files and directories currently installed.)
Preparing to unpack libcudnn7-dev_7.6.2.24-1+cuda10.0_amd64.deb ...
Unpacking libcudnn7-dev (7.6.2.24-1+cuda10.0) ...
Setting up libcudnn7-dev (7.6.2.24-1+cuda10.0) ...
update-alternatives: using /usr/include/x86_64-linux-gnu/cudnn_v7.h to provide /usr/include/cudnn.h (libcudnn) in auto mode
```

**同じものを2回読み込ませると、後ろでつまづくので注意してください**
パッケージへの反映は冪等 (何回やっても同じ結果) なので、不安なら、それぞれもう一度行なっても良いかと思います...


+ CUDA と違い、こちらはライブラリなので `dpkg -i` するだけで良いのだと思います。
( 別途 `apt install` などする必要はない (と思う) )


でも私は心配性なので、一応ここで `apt update` と `apt upgrade` を行なっておきました。


* cuDNN インストールされているかの確認:

    - `cat /usr/include/cudnn.h | grep CUDNN_MAJOR -A 2`

```
$ cat /usr/include/cudnn.h | grep CUDNN_MAJOR -A 2
#define CUDNN_MAJOR 7
#define CUDNN_MINOR 6
#define CUDNN_PATCHLEVEL 2
--
#define CUDNN_VERSION (CUDNN_MAJOR * 1000 + CUDNN_MINOR * 100 + CUDNN_PATCHLEVEL)

#include "driver_types.h"
```

## まとめ
以上で Ubuntu Server 上に NDIVIA Driver / CUDA / cuDNN のインストールが終了です。
お疲れ様でした。
快適な GPGPU学習 life を。


## 後編も書きましたので何卒..
* [後編](https://qiita.com/daichildren98/items/acc1abcca37dfa521fea)
