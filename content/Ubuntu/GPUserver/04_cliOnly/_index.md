---
title: "GPGPU 環境構築 (CLI 完結)"
date: 2020-09-23T13:23:54+09:00
draft: false
weight: 5
---

ここでは、ほとんど CLI で完結する GPUserver の立て方を紹介します。

できる限りコピペで実行できるよう「説明はコメントアウト、プロンプトはなし」を心がけています。

## 1. NVIDIA-Driver をインストールする前に、デフォルトの GPU のドライバを無効化する

```sh
# backup file: /etc/modprobe.d/blacklist.conf
cp -p /etc/modprobe.d/blacklist.conf /etc/modprobe.d/blacklist.conf.orig

# add `nouveau` in blacklist.conf
cat '' >> ~/.bashrc
cat 'blacklist nouveau' >> ~/.bashrc
cat 'options nouveau modeset=0' >> ~/.bashrc

# update
update-initramfs -u

# please reboot after execute this shell script
```

終わったら `reboot` しておいてね。


## 2. NVIDIA-Driver のインストール

```sh
add-apt-repository ppa:graphics-drivers/ppa

apt update
apt install nvidia-driver-440

# please reboot after execute this shell script
```

終わったら `reboot` しておいてね。(part2)


## 3. CUDA のインストール

CUDA は割とバージョンを気にしないといけない。(詳細後述)


とりあえず先にスクリプトの紹介

```sh
# prepare
apt update && apt upgrade -y && apt autoremove 

# install cuda below
apt-key adv --fetch-keys http://developer.download.nvidia.com/compute/cuda/repos/ubuntu1804/x86_64/7fa2af80.pub

mkdir ~/downloads
cd ~/downloads

wget http://developer.download.nvidia.com/compute/cuda/repos/ubuntu1804/x86_64/cuda-repo-ubuntu1804_10.2.89-1_amd64.deb

dpkg -i cuda-repo-ubuntu1804_10.2.89-1_amd64.deb

apt update

# install cuda 10.0.XX (please confirm cuda version)
apt install cuda-10-0

# export PATH for cuda in ~/.bashrc
echo '' >> ~/.bashrc
echo 'export PATH="/usr/local/cuda/bin:$PATH"' >> ~/.bashrc
echo 'export LD_LIBRARY_PATH="/usr/local/cuda/lib64:$LD_LIBRARY_PATH"' >> ~/.bashrc

# check
source ~/.bashrc
nvcc --version

# please reboot after executed this shell script
# $ reboot (いらないかも)
```

reboot は多分いらない


### CUDA のバージョン

GPGPU (サーバ) 環境を立てるにあたって、色々とインストールするものがあるが、それらのバージョンを気にしないといけないのです。

気をつけるべきポイントはたいてい「CUDA と cudnn (と tensorflow) のバージョン」です。

少し前までは、[tensorflow official guide](https://www.tensorflow.org/install/source?hl=ja#gpu) でチェック済みの依存関係とかが表で調べる事ができたのですが、最近のもの (CUDA 11 とか) はないので、自ら探り探りするか、ここにあるような少し以前のバージョンでインストールするか、という選択肢が考えられるかと思います。

ちなみに私は、NVIDIA-Driver をインストールし、`nvidia-smi` すると、右上に `CUDA 10.X` みたいな CUDA のバージョンが出るので、それに合わせて `CUDA` のバージョンを指定してインストールします。

さらに、この `CUDA` のバージョンに基づいて、`cuDNN` のバージョンの決定をして、インストールする、という方法で今まで環境を立ててきました。

最近 (執筆@2020/09/15) NVIDIA-Driver が 450 になって `nvidia-smi` すると `CUDA 11.X` を require(?) されるような感じですが、`CUDA: 10.0.130 | cuDNN: 7.6.5 | tensorflow: 1.14` でうまく動く環境を作る事ができたので、以下その環境で作っていきたいと思います。


## 4. cuDNN のインストール

まずはスクリプトから。

```
echo "deb https://developer.download.nvidia.com/compute/machine-learning/repos/ubuntu1804/x86_64 /" | sudo tee /etc/apt/sources.list.d/nvidia-ml.list
apt update
apt install libcudnn7-dev

# check
cat /usr/include/cudnn.h | grep -i cudnn_major -A 2
```

cuDNN はライブラリみたいなもので、`Runtime` と `Develop` という 2種類をインストールするのですが `apt install libcudnnX-dev` ( `Develop` ) をインストールすれば、`Runtime` も入るようです。

スクリプトの最後の1行を単体で実行すると、`cuDNN` のバージョンを確認できます。


## optional. Anaconda のインストール

私は Python の実行環境を Anaconda で作っているので、Anaconda も合わせてインストールしておきます。

```
cd ~/downloads

wget https://repo.anaconda.com/archive/Anaconda3-2019.07-Linux-x86_64.sh

bash Anaconda3-*-Linux-x86_64.sh

source ~/.bashrc
```


### 仮想環境の作成

```
conda create -n tfgpu python=3.6 tensorflow==1.14
```

( log を見る限り、もしかしたら、↑ これだけで cuda, cudnn もインストールできるかも?? )

anaconda で GPGPU 環境を立てる、ということもできるので、もしかしたら省略形にできるかもです。

## 確認

```
python

import tensorflow as tf
tf.test.is_gpu_available()

# True になれば OK!!
```


## (軽い) トラブルシュート

### `Could not dlopen library 'libcudnn.so.7'` とか...

`libcudnn` に関してごにょごにょ言われる場合は、およそ cuDNN 周りで問題があるはずです。 (のだと思います)

まずは探してみましょう。

```
find / -name "libcudnn*"
```

これでファイル (までのパス) が返ってこなかった場合は、もう一度 cuDNN のインストールを試みて見ると良いかと思います。

私が以前書いた、「もう迷わない」の記事の方でも、異なった方法で cuDNN のインストールを行なっている (ちょっと複雑で、手間がかかる方法ですが...) ので、そちらの方で試して見るのも良いかと...


### `tensorflow-gpuで libcublas.so.10.0のImportError` とか...

`libcublas` とか `10.0....` のところを見ると、`CUDA` 周辺のトラブルかと予想します。

以下の2つの点をチェックしてみてください
1. CUDA のバージョン
2. CUDA の PATH 

#### 1. CUDA のバージョン

こちらに関しては tensorflow が require する CUDA のバージョンに合わせる必要があるかと思います。(逆: CUDA のバージョンに合う tensorflow のバージョンを選択する も OK かも??)

バージョンの取り換えは

```
apt install cuda-10-0
```

の `cuda-数字` の部分で指定して、上書き的にインストールするか

心配だったら

```
apt --purge remove cuda*

apt install cuda-10-0
```

のように、一度 remove してから再インストールをお試しすると良いかと思います。


#### 2. CUDA の PATH

こちらに関しては、基本的には以下の2つが通っていれば良いと思われるのですが

```
export PATH="/usr/local/cuda/bin:$PATH"
export LD_LIBRARY_PATH="/usr/local/cuda/lib64:$LD_LIBRARY_PATH"
```

場合によっては別の場所に配置されてしまうこともあるようですので、

```
find / -name {ImportError となるファイル名}
```

にてファイルを探し、そのファイルのあるディレクトリに PATH が通っていないようでしたら

```
export LD_LIBRARY_PATH="/usr/local/cuda/lib64:/path/to/ImportError/file:$LD_LIBRARY_PATH"
```

↑ このように `:` で区切って PATH を追加してあげると良いかと思います。


## Link

* [Ubuntu 20.04へのCUDAインストール方法](https://qiita.com/yukoba/items/c4a45435c6ee5d66706d)

* [エラー対処 Could not dlopen library 'libcudnn.so.7'](https://qiita.com/ysuzuki19/items/3095398ea4d8d87a6bb9)

* [StackOverFlow ImportError: libcublas.so.10.0: cannot open shared object file](https://stackoverflow.com/questions/55224016/importerror-libcublas-so-10-0-cannot-open-shared-object-file-no-such-file-or)

* [tensorflow-gpuで libcublas.so.10.0のImportError](https://qiita.com/Uejun/items/fbb579374eafab8633d6)


