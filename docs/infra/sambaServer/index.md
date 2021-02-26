---
id: infra-sambaServer
title: "Samba サーバを立てる"
sidebar_label: "Samba サーバを立てる"
hide_table_of_contents: false
keywords:
  - infra
  - ubuntu
  - samba
---

## 前提

ubuntu サーバ上に Samba を立てたい。
ubuntu がインストールされたマシン (仮想マシンでも OK) があることを前提に進める。

cf. [Smb | Samba とは](https://ja.wikipedia.org/wiki/Samba)

簡単にまとめると **「Unix/Linux のサーバに、
Windows のファイルサーバのような振る舞いをさせるためのソフトウェア」** だと思っている。

### install

```shell
apt update

apt install -y samba
```

#### check installed and process works (やらなくても良)

```shell
# installed?
dpkg -l | grep -i samba

# process?
ps -ef | grep -i samba
```


### configuration

* 共有ファイルの入るディレクトリを作成

```shell
mkdir /home/share
```

* 共有ファイルに関する設定を行う

```shell
vi /etc/samba/smb.conf
```


### the place of log files
ログファイルはここにあるそうです ⬇️

```
# /etc/samba/smb.conf に書かれている
/var/log/samba/log.%m
```


<!-- TODO: ここにファイルの編集箇所 && 内容をわかりやすい感じで書く -->


### デーモンの再起動など

* 設定を変更したので、`smbd` を再起動する

```shell
# ubuntu 16.04 or later (systemctl を用いる場合)
systemctl restart smbd

# マシンが起動されたときに、smbd も一緒に起動する設定
systemctl enable smbd

# check
systemctl status smbd
```

```shell
# ubuntu 14.04 までなど (service を用いる場合)
service smbd restart

# 自動起動設定
service smbd enable
```

ここまで行えば、同一ネットワークに接続している PC から `smb://"ip-address"` にアクセスすると、ファイルサーバーとして使うことが出来る。


<!--

TODO: ファイヤーウォールを有効化したときの場合も検証する
:::note

if you enabled firewall, then do this 👇

```sh
ufw allow 80
```

:::

-->

### Links (ubuntu)
* [Ubuntuでファイルサーバーをたてる（Samba）](https://qiita.com/msrks/items/1385cf13258dd1a0da08)

* [Sambaを導入する理由](https://thinkit.co.jp/free/compare/3/1/1.html)