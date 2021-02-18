---
id: infra-apacheServer
title: "Apache サーバについてのまとめ"
sidebar_label: "apache まとめ"
slug: infra/apacheServer/
hide_table_of_contents: false
keywords:
  - infra
  - apache
  - ubuntu
---

## On ubuntu server.

ubuntu サーバ上での apache の扱い

### install

```shell
apt install apache2
```

### check installed and process works

```shell
# installed?
dpkg -l | grep apache

# process?
ps -ef | grep apache

# access check
curl localhost && echo success || echo failed
```

:::note

if you enabled firewall, then do this 👇

```sh
ufw allow 80
```

:::

### (Default) Document Root

```
/var/www/html
```


### the place of log files
`access_log` and `error_log` is here ⬇️

```
/var/log/apache2
```

* 変更は `/etc/apache2/httpd.conf` をいじる。

### Links (ubuntu)
* [UbuntuとApacheでウェブサーバを立てる](https://qiita.com/sakkuntyo/items/03742bad0f57a4f46b07)
* [access_logおよびerror_logの出力場所](https://qiita.com/Mitsunori_Tsukada/items/9e7fad3e3ea49fc9a2c7)
* [ubuntuでapache2のDocumentRootを変更するまで](https://qiita.com/shita_fontaine/items/40a086265f0cf07d10e0)