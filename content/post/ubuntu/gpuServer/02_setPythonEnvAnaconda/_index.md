---
title: "Anaconda 環境の構築"
date: 2020-09-23T13:13:28+09:00
draft: false
weight: 3
---

# python * AI 環境構築 on Ubuntu 18.04
* 後編 (python / tensorflow 編)
    - [前編はこちら (qiita に飛びます) ](https://qiita.com/daichildren98/items/ec2f62d49dae7e449570)
* author : 鈴木 大智 (user名 : sudachi)
    - pc name : AIserver
* 最終更新 : 2020/10/01

---

## 0. 前編でインストールしたパッケージの確認をする。

### 0.1. nvidia driver

* ` nvidia-smi` と実行し、

```
+-----------------------------------------------------------------------------+
| NVIDIA-SMI 455.23.05    Driver Version: 455.23.05    CUDA Version: 11.1     |
|-------------------------------+----------------------+----------------------+
| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
|                               |                      |               MIG M. |
|===============================+======================+======================|
|   0  GeForce RTX 2070    On   | 00000000:01:00.0 Off |                  N/A |
| 30%   28C    P8     8W / 175W |      1MiB /  7982MiB |      0%      Default |
|                               |                      |                  N/A |
+-------------------------------+----------------------+----------------------+
```

みたいなものが表示されたら OK。

### 0.2. CUDA
* `$ nvcc -V` と実行

```
Command 'nvcc' not found ...
```

と表示された場合は PATH を通す (か、インストールする) 必要がある。


#### CUDA: PATH の通し方
* `.bashrc` を編集。(心配な方は backup をお願いします)

PATH を通します。
(エディタはお好みで...) 下記の2行を一番最後に追記します。

```
emacs ~/.bashrc
```

```
export PATH="/usr/local/cuda/bin:$PATH"
export LD_LIBRARY_PATH="/usr/local/cudalib64:$LD_LIBRARY_PATH"
```

* (別解) コピペでできる!

```
echo '' >> ~/.bashrc
echo 'export PATH="/usr/local/cuda/bin:$PATH"' >> ~/.bashc
echo 'export LD_LIBRARY_PATH="/usr/local/cudalib64:$LD_LIBRARY_PATH"' >> ~/.bashrc
```

* 変更内容の適用します。次のどちらかを実行すれば OK です
    - `.bashrc` の再読み込み : `source ~/.bashrc`
    - SHELL の再起動 : `exec $SHELL -l`

* CUDAのパッケージ確認

    - `$ nvcc -V`

```
nvcc: NVIDIA (R) Cuda compiler driver
Copyright (c) 2005-2018 NVIDIA Corporation
Built on Sat_Aug_25_21:08:01_CDT_2018
Cuda compilation tools, release 10.0, V10.0.130
```

のように表示されれば OK。

### 0.3. cudnn

* パッケージ確認
    - `$ cat /usr/include/cudnn.h | grep CUDNN_MAJOR - -A 2`

```
#define CUDNN_MAJOR 7
#define CUDNN_MINOR 6
#define CUDNN_PATCHLEVEL 2
--
#define CUDNN_VERSION (CUDNN_MAJOR * 1000 + CUDNN_MINOR * 100 + CUDNN_PATCHLEVEL)

#include "driver_types.h"
```

のように表示されれば OK。

* もしここまででうまくいかない部分などあれば、ぜひ[前編](https://qiita.com/daichildren98/items/ec2f62d49dae7e449570)も参照していただけると嬉しいです。


## 1. anaconda 環境を作る

### anaconda の install
* インストーラを web からダウンロードする。
    **(注意: カレントディレクトリ下にダウンロードされます)**
    - `$ wget https://repo.anaconda.com/archive/Anaconda3-2019.07-Linux-x86_64.sh`
        + *注意* 上記は 2019/08/19 時点での最新版です。

```
Anaconda3-2019.07-Linux-x86_64.sh
```

がカレント下にあれば OK です。


* インストールの実行
    - `bash Anaconda3-2019.07-Linux-x86_64.sh`
    - 確認事項をよく見ながらインストールを実行します。
	
* インストールを実行していいですか? (良いなら Enter)

```
Welcome to Anaconda3 2019.07

In order to continue the installation process, please review the license
agreement.
Please, press ENTER to continue
>>> 
```

* ライセンスの文章が出てくるので space キーで読んでいきます。

    - 同意しますか? (同意する場合は yes と入力し Enter)

```
...
Do you accept the license terms? [yes|no]
[no] >>> yes
``` 

* anaconda を install する場所を聞かれます。
	自分のユーザのディレクトリ下であることを確認し、これで良ければ Enter します。

```
Anaconda3 will now be installed into this location:
/home/sudachi/anaconda3

- Press ENTER to confirm the location
- Press CTRL-C to abort the installation
- Or specify a different location below

[/home/sudachi/anaconda3] >>>  
```

* パッケージが色々出てくる (大抵、Enter で良いと思います...)
    - conda init (anacondaの初期化) をしてしまっていいですか と聞かれるので、いい場合は yes を入力し Enter 

``` 
Do you wish the installer to initialize Anaconda3
by running conda init? [yes|no]
[no] >>> yes
```

* プロンプトが帰ってきたらインストールは終了です。
    - お疲れさまでした。


* 一応、インストール後、動くか確認してみます。
   - `$ conda -V`

```
conda: command not found
```

* このように文句を言われた場合は、`.bashrc` を再読み込みします。
    - `source ~/.bashrc` あるいは
    - `exec $SHELL -l` を実行します。

    - プロンプトの頭に `(base) sudachi@AIserver:~$` のように 仮想環境が activate されていれば成功です。
        + `$ conda -V`

            > conda 4.7.10



* conda init の 際に no を選択した方は PATH を通す必要があるかと思われます。
    - `.bashrc` を編集する。

    - `emacs ~/.bashrc`

```
export PATH="/home/[user_name]/anaconda3/bin:$PATH"
```

* (別解) コピペでできる!

```
echo '' >> ~/.bashrc
echo 'export PATH="/home/[user_name]/anaconda3/bin:$PATH"' >> ~/.bashrc
```

* `[user_name]` の部分は自分のユーザ名に置き換えてください。


### 仮想環境を作成する
* anaconda の仮想環境は `$ conda create -n [仮想環境名] python` で作ることができます。

* **注意!! ただし、ここでは、Python のバージョンを 3.6 に指定する必要があります**
    - なので以下のように指定して作成してください。
        + `$ conda create -n 環境名 python=3.6`

    - (例) `$ conda create -n tfgpu python=3.6`

    - 作成される場所
        + `environment location: /home/[user_name]/anaconda3/envs/tfgpu` 

    - こんなパッケージが install されますよ。
        続けていいですか? (いい場合は y を入力し Enter)

```
The following NEW packages will be INSTALLED:
...
Proceed ([y]/n)? y
```

* 完了

```
Preparing transaction: done
Verifying transaction: done
Executing transaction: done
#
# To activate this environment, use
#
#     $ conda activate tfgpu
#
# To deactivate an active environment, use
#
#     $ conda deactivate
```


* 仮想環境を activate してみる。
    - `$ conda activate tfgpu`

    - プロンプトが以下のように変わったら成功
        + `(tfgpu) user_name@PC:~$` 



### tensorflow-gpu を install
* anadonda に必要なパッケージをinstallする。

* せっかくなので、さっき作成した仮想環境で行うといいと思います。 

* 必要なパッケージは以下の通り
    - tensorflow-gpu(=1.14.0)
        + tensorflow--gpu は pip で入れて大丈夫 (なはず。)

    - tensorflow
        + `$ pip install tensorflow-gpu==1.14`
        + conda install で入れてもそれはそれでうまくいったという話もあります。めげずに頑張ってください。(?)

* tensorflow で GPU使えてるか確認。
    - `$ python`

* 確認方法1

```python
import tensorflow as tf
tf.test.is_gpu_available()
```

* 確認方法2

```python
from tensorflow.python.client import device_lib
device_lib.list_local_devices()
```

* `device_type: "GPU"` という表示があればひとまず成功です。
    - GPGPU 学習の初回では keras とかがないよ。と言われることもあるので、その場合は pip install してあげてください。


* 以上で基本的な環境構築は終了です。
* お疲れさまでした。よい GPGPU life を。

* [前編はこちら](https://qiita.com/daichildren98/items/ec2f62d49dae7e449570)

## 番外編
* プログラム作成時の注意:
    - GPGPU 学習のプログラムを作成した際は、tensorflow の session の設定に以下のいずれかを指定してください。
        + 一応、私の環境では、3種類のいずれでもうまくいくことがわかっています。
		+ **注意: tensorflow 1.x の場合の設定です。**


* 設定 1

```py
config = tf.ConfigProto()
config.gpu_options.allow_growth=True
sess = tf.Session(config=config)
```


* 設定 2

```py
session_config = tf.ConfigProto(gpu_options=tf.GPUOptions(allow_growth=True))
tf.Session(config=session_config)
```


* 設定 3

```py
from keras.backend import tensorflow_backend
config = tf.ConfigProto(gpu_options=tf.GPUOptions(allow_growth=True))
session = tf.Session(config=config)
tensorflow_backend.set_session(session)
```

* 設定 4
    - 設定 1 ~ 3 にある `allow_growth=True` は, 最初に幾らか GPU メモリを確保し, 足りなくなったら動的に上限まで確保するという命令です。
     - 一方, 設定4 は書き方は 設定1 とほぼ同じですが, `config.gpu_options` の設定で「GPU メモリの半分 (0.5)」を確保する, という命令になっています。GPUメモリに乗っているデータが GPU メモリの半分を越えると `Out Of Memory Error (OOM Error)` を起こしてプロセスが止まります。


```python
import tensorflow as tf
import keras
from keras import backend as K
config = tf.ConfigProto()
config.gpu_options.per_process_gpu_memory_fraction=0.5
sess = tf.Session(config=config)
K.set_session(sess)
```

## 番外編2

tensorflow 2.x における tensorflow-gpu session の設定についても、以下に例を示しておきます。

* 設定1

```python
import tensorflow as tf

gpus = tf.config.experimental.list_physical_devices('GPU')
if gpus:
    try:
        # Restrict TensorFlow to only use the fourth GPU
		tf.config.experimental.set_visible_devices(gpus[0], 'GPU')

		# Currently, memory growth needs to be the same across GPUs
		for gpu in gpus:
		    tf.config.experimental.set_memory_growth(gpu, True)
			logical_gpus = tf.config.experimental.list_logical_devices('GPU')
			print(len(gpus), "Physical GPUs,", len(logical_gpus), "Logical GPUs")
	except RuntimeError as e:
        # Memory growth must be set before GPUs have been initialized
        print(e)
```

* 設定2

```python
physical_devices = tf.config.experimental.list_physical_devices('GPU')
if len(physical_devices) > 0:
    for k in range(len(physical_devices)):
	    tf.config.experimental.set_memory_growth(physical_devices[k], True)
		print('memory growth:', tf.config.experimental.get_memory_growth(physical_devices[k])
else:
    print("Not enough GPU hardware devices available")
```

[tf 2.x で allow_growth 設定](https://qiita.com/studio_haneya/items/4dfaf2fb2ac44818e7e0)
