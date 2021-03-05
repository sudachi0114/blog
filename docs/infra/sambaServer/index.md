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

# process (systemctl start smbd してないと出てこない)
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

* 変更箇所はおよそ以下の通り (5箇所)

```conf
# /etc/samba/smb.conf (途中省略してあります, 行数はおよその目安です)

[global]
# (*) 25行目: 以下2行追記 (windows からのアクセスがなければ、多分2行目はいらない??)
unix charset = UTF-8
dos charset = CP932

# (*) 32行目: 必要があれば、workgroup もいじるらしい。(今回は特にいじってない)
   workgroup = WORKGROUP

# (*) 43行目: ここのコメントアウトを取る & アクセスを許可する ip : 192.168.1.0/24 を追記
   interfaces = 127.0.0.0/8 192.168.1.0/24 eth0

# (*) 51行目: ここのコメントアウトを取る & 2行目を追記
   bind interfaces only = yes
   map to guest = Bad User

# (*) 最終行: 共有フォルダの設定を追記
[Share]
   path = /home/share
   writable = yes
   guest ok = yes
   guest only = yes
   create mode = 0644
   directory mode = 0755
```

<details>
<summary>設定ファイル `/etc/samba/smb.conf` の全文はこちら</summary>

```
#
# Sample configuration file for the Samba suite for Debian GNU/Linux.
#
#
# This is the main Samba configuration file. You should read the
# smb.conf(5) manual page in order to understand the options listed
# here. Samba has a huge number of configurable options most of which 
# are not shown in this example
#
# Some options that are often worth tuning have been included as
# commented-out examples in this file.
#  - When such options are commented with ";", the proposed setting
#    differs from the default Samba behaviour
#  - When commented with "#", the proposed setting is the default
#    behaviour of Samba but the option is considered important
#    enough to be mentioned here
#
# NOTE: Whenever you modify this file you should run the command
# "testparm" to check that you have not made any basic syntactic 
# errors. 

#======================= Global Settings =======================

[global]
# (*) 25行目: 以下2行追記 (windows からのアクセスがなければ、多分2行目はいらない??)
unix charset = UTF-8
dos charset = CP932

## Browsing/Identification ###

# Change this to the workgroup/NT-domain name your Samba server will part of
# (*) 32行目: 必要があれば、workgroup もいじるらしい。(今回は特にいじってない)
   workgroup = WORKGROUP

# server string is the equivalent of the NT Description field
   server string = %h server (Samba, Ubuntu)

#### Networking ####

# The specific set of interfaces / networks to bind to
# This can be either the interface name or an IP address/netmask;
# interface names are normally preferred
# (*) 43行目: ここのコメントアウトを取る & アクセスを許可する ip : 192.168.1.0/24 を追記
   interfaces = 127.0.0.0/8 192.168.1.0/24 eth0

# Only bind to the named interfaces and/or networks; you must use the
# 'interfaces' option above to use this.
# It is recommended that you enable this feature if your Samba machine is
# not protected by a firewall or is a firewall itself.  However, this
# option cannot handle dynamic or non-broadcast interfaces correctly.
# (*) 51行目: ここのコメントアウトを取る & 2行目を追記
   bind interfaces only = yes
   map to guest = Bad User


#### Debugging/Accounting ####

# This tells Samba to use a separate log file for each machine
# that connects
   log file = /var/log/samba/log.%m

# Cap the size of the individual log files (in KiB).
   max log size = 1000

# We want Samba to only log to /var/log/samba/log.{smbd,nmbd}.
# Append syslog@1 if you want important messages to be sent to syslog too.
   logging = file

# Do something sensible when Samba crashes: mail the admin a backtrace
   panic action = /usr/share/samba/panic-action %d


####### Authentication #######

# Server role. Defines in which mode Samba will operate. Possible
# values are "standalone server", "member server", "classic primary
# domain controller", "classic backup domain controller", "active
# directory domain controller". 
#
# Most people will want "standalone server" or "member server".
# Running as "active directory domain controller" will require first
# running "samba-tool domain provision" to wipe databases and create a
# new domain.
   server role = standalone server

   obey pam restrictions = yes

# This boolean parameter controls whether Samba attempts to sync the Unix
# password with the SMB password when the encrypted SMB password in the
# passdb is changed.
   unix password sync = yes

# For Unix password sync to work on a Debian GNU/Linux system, the following
# parameters must be set (thanks to Ian Kahan <<kahan@informatik.tu-muenchen.de> for
# sending the correct chat script for the passwd program in Debian Sarge).
   passwd program = /usr/bin/passwd %u
   passwd chat = *Enter\snew\s*\spassword:* %n\n *Retype\snew\s*\spassword:* %n\n *password\supdated\ssuccessfully* .

# This boolean controls whether PAM will be used for password changes
# when requested by an SMB client instead of the program listed in
# 'passwd program'. The default is 'no'.
   pam password change = yes

# This option controls how unsuccessful authentication attempts are mapped
# to anonymous connections
   map to guest = bad user

########## Domains ###########

#
# The following settings only takes effect if 'server role = primary
# classic domain controller', 'server role = backup domain controller'
# or 'domain logons' is set 
#

# It specifies the location of the user's
# profile directory from the client point of view) The following
# required a [profiles] share to be setup on the samba server (see
# below)
;   logon path = \\%N\profiles\%U
# Another common choice is storing the profile in the user's home directory
# (this is Samba's default)
#   logon path = \\%N\%U\profile

# The following setting only takes effect if 'domain logons' is set
# It specifies the location of a user's home directory (from the client
# point of view)
;   logon drive = H:
#   logon home = \\%N\%U

# The following setting only takes effect if 'domain logons' is set
# It specifies the script to run during logon. The script must be stored
# in the [netlogon] share
# NOTE: Must be store in 'DOS' file format convention
;   logon script = logon.cmd

# This allows Unix users to be created on the domain controller via the SAMR
# RPC pipe.  The example command creates a user account with a disabled Unix
# password; please adapt to your needs
; add user script = /usr/sbin/adduser --quiet --disabled-password --gecos "" %u

# This allows machine accounts to be created on the domain controller via the 
# SAMR RPC pipe.  
# The following assumes a "machines" group exists on the system
; add machine script  = /usr/sbin/useradd -g machines -c "%u machine account" -d /var/lib/samba -s /bin/false %u

# This allows Unix groups to be created on the domain controller via the SAMR
# RPC pipe.  
; add group script = /usr/sbin/addgroup --force-badname %g

############ Misc ############

# Using the following line enables you to customise your configuration
# on a per machine basis. The %m gets replaced with the netbios name
# of the machine that is connecting
;   include = /home/samba/etc/smb.conf.%m

# Some defaults for winbind (make sure you're not using the ranges
# for something else.)
;   idmap config * :              backend = tdb
;   idmap config * :              range   = 3000-7999
;   idmap config YOURDOMAINHERE : backend = tdb
;   idmap config YOURDOMAINHERE : range   = 100000-999999
;   template shell = /bin/bash

# Setup usershare options to enable non-root users to share folders
# with the net usershare command.

# Maximum number of usershare. 0 means that usershare is disabled.
#   usershare max shares = 100

# Allow users who've been granted usershare privileges to create
# public shares, not just authenticated ones
   usershare allow guests = yes

#======================= Share Definitions =======================

# Un-comment the following (and tweak the other settings below to suit)
# to enable the default home directory shares. This will share each
# user's home directory as \\server\username
;[homes]
;   comment = Home Directories
;   browseable = no

# By default, the home directories are exported read-only. Change the
# next parameter to 'no' if you want to be able to write to them.
;   read only = yes

# File creation mask is set to 0700 for security reasons. If you want to
# create files with group=rw permissions, set next parameter to 0775.
;   create mask = 0700

# Directory creation mask is set to 0700 for security reasons. If you want to
# create dirs. with group=rw permissions, set next parameter to 0775.
;   directory mask = 0700

# By default, \\server\username shares can be connected to by anyone
# with access to the samba server.
# Un-comment the following parameter to make sure that only "username"
# can connect to \\server\username
# This might need tweaking when using external authentication schemes
;   valid users = %S

# Un-comment the following and create the netlogon directory for Domain Logons
# (you need to configure Samba to act as a domain controller too.)
;[netlogon]
;   comment = Network Logon Service
;   path = /home/samba/netlogon
;   guest ok = yes
;   read only = yes

# Un-comment the following and create the profiles directory to store
# users profiles (see the "logon path" option above)
# (you need to configure Samba to act as a domain controller too.)
# The path below should be writable by all users so that their
# profile directory may be created the first time they log on
;[profiles]
;   comment = Users profiles
;   path = /home/samba/profiles
;   guest ok = no
;   browseable = no
;   create mask = 0600
;   directory mask = 0700

[printers]
   comment = All Printers
   browseable = no
   path = /var/spool/samba
   printable = yes
   guest ok = no
   read only = yes
   create mask = 0700

# Windows clients look for this share name as a source of downloadable
# printer drivers
[print$]
   comment = Printer Drivers
   path = /var/lib/samba/printers
   browseable = yes
   read only = yes
   guest ok = no
# Uncomment to allow remote administration of Windows print drivers.
# You may need to replace 'lpadmin' with the name of the group your
# admin users are members of.
# Please note that you also need to set appropriate Unix permissions
# to the drivers directory for these users to have write rights in it
;   write list = root, @lpadmin

# (*) 最終行: 共有フォルダの設定を追記
[Share]
   path = /home/share
   writable = yes
   guest ok = yes
   guest only = yes
   create mode = 0644
   directory mode = 0755
```

</details>


### 設定ファイルのバリデーション

`testparm` というコマンドで、設定ファイル `smb.conf` のバリデーションが行えるらしい。

```
testparm

# 実行結果
Load smb config files from /etc/samba/smb.conf
Loaded services file OK.    # <= >> ここが出て来てればたぶん OK <<
Server role: ROLE_STANDALONE

Press enter to see a dump of your service definitions

# Global parameters
[global]
	bind interfaces only = Yes
	dos charset = CP932
	interfaces = 127.0.0.0/8 192.168.1.0/24 eth0

...

[Share]  # ここに共有フォルダの設定が出てくる
	create mask = 0644
	guest ok = Yes
	guest only = Yes
	path = /home/share
	read only = No


```


### the place of log files
ログファイルはここにあるそうです ⬇️

```
# /etc/samba/smb.conf に書かれている
/var/log/samba/log.%m
```


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


:::note

ファイヤーウォールを有効化している場合は、`445`番ポートを開けるのを忘れずに 👇

```sh
ufw allow 445
```

:::


### Links (ubuntu)
* [Ubuntuでファイルサーバーをたてる（Samba）](https://qiita.com/msrks/items/1385cf13258dd1a0da08)
* [Sambaの環境構築手順#3.4 ポート番号の開放](https://qiita.com/hana_shin/items/e768ef63bdeeef3ada39#34-%E3%83%9D%E3%83%BC%E3%83%88%E7%95%AA%E5%8F%B7%E3%81%AE%E9%96%8B%E6%94%BE)

* [Sambaを導入する理由](https://thinkit.co.jp/free/compare/3/1/1.html)

* [Sambaでファイルサーバーを構築しよう](https://www.atmarkit.co.jp/ait/articles/1612/01/news184.html)
