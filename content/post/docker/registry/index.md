---
title: "Docker Registry について"
date: 2020-10-15T18:43:43+09:00
draft: false
---

# Docker Registry についてまとめる
初めに: 適宜更新予定です。


## Registry との連携

### local に Docker Registry を立てる

```sh
docker run -d -p 5000:5000 --name registry registry:latest
```

### remote (GitLab Container Registry など) にログインする

```sh
docker login {registry.gitlab.com}
```

`{registry.gitlab.com}` の部分はご自身の GitLab のリンクなどに置き換えてください。

[Gitlab] > [Projects] > [Your Projects] > {Project を選択}

Project の中に入ったら、
[Packages and Repositries] > [Container Registry] > [CLI Commands] > [login] からコマンドが参照できると思います。

![login_ref](./images/login_ref.png?width=30pc)

こんな感じで。

* ちなみに logout は

```sh
docker logout {registry.gitlab.com}
```

でできます。


---


### Docker registry への push

* 自分のレジストリ上のイメージを登録

```sh
# そのまま push
docker tag myimage localhost:5000/myfirstimage

# リポジトリを指定 (suda-repo) して push
docker tag myimage:hoge localhost:5000/suda-repo/myremoimage:fuga
```

ちょっとむずかしいことを書きますが

```sh
docker tag {image-name}:{tag} {registry-place}:{port}/{your-repository-name}/{remote-image-name}:{remote-tag}
```

です。


* Docker registry へ push

```
docker push localhost:5000/myfirstimage
```

など、エンドポイントを指定すると、そこに紐づいた (docker tag した) image が push されて登録 (regist) されます。

----------


### Docker Registry から image を取得する

```
docker pull localhost:5000/myfirstimage

# tag を削除しておくと本格的な pull になるかも...
docker rmi localhost:5000/myfirstimage
```

## レジストリの停止と、全てのデータを削除

```
docker stop registry && docker rm -v registry
```


* TIPS: registry の docker container を立てる際に、以下のようにすれば、`docker stop registry` と同時にコンテナが破棄されます。

```
docker run -d -p 5000:5000 --rm --name registry registry:latest  
```

----------

### local のディレクトリと紐づけて永続化する例

```sh
docker run -d -p 5000:5000 -v /var/opt:/var/lib/registry registry:latest
```

参考からの引用です。

> ホスト側、コンテナ側共に5000番ポートでつないでいます。これでlocalhost:5000などとするとコンテナの5000番ポートにフォワードされます
> (また、Registry:2.3.0 では) /var/lib/regstry上にpushされたイメージが保管されます。そのため、ホスト側の/var/optをコンテナ上の/var/lib/registryにマウントしてます。

----------

## local のレジストリの一覧がみたい

* イメージ一覧を確認

https://{your-registry-place}/v2/_catalog

* イメージのタグを確認

https://{your-registry-place}/v2/{image-name}/tags/list


* localhost に立てた場合は、それぞれ以下の通りです。

http://localhost:5000/v2/_catalog

http://localhost:5000/v2/{image-name}/tags/list


### もっとリッチな UI が欲しい (引用のみ、動作未検証)

> ブラウザでレジストリを確認したい場合(docker-registry-frontend)

> 簡易的なレジストリコンテナですが、何が入っているか可視化したいことがあります。
> その場合はdocker-registry-frontendを使ってみましょう

> GitHubによると
> 以下のように実行すれば動くことがわかります

```
$ docker run \
  -d \
  -e ENV_DOCKER_REGISTRY_HOST=ENTER-YOUR-REGISTRY-HOST-HERE \
  -e ENV_DOCKER_REGISTRY_PORT=ENTER-PORT-TO-YOUR-REGISTRY-HOST-HERE \
  -p 8080:80 \
  konradkleine/docker-registry-frontend:v2
```

> * ENV_DOCKER_REGISTRY_HOST=にはレジストリコンテナのIPを指定します。
>  環境変数なのでlocalhostはだめでした。IPにしてください。
>  ENV_DOCKER_REGISTRY_HOST=192.168.0.1という形です
> * ENV_DOCKER_REGISTRY_PORT=にはポート番号を入れます。
>  上記の例では5000番ですのでENV_DOCKER_REGISTRY_PORT=5000という形です

起動後はブラウザでアクセスしてみましょう

localhost:8080

-----

## LINKS

* [(official) Docker レジストリ](https://docs.docker.jp/registry/index.html)

* [Dockerコマンド一覧](https://qiita.com/nimusukeroku/items/72bc48a8569a954c7aa2)
* [GitLab Container Registry](https://qiita.com/masakura/items/802f4b8ce322d2543c80)

* [プライベートなDockerレジストリサーバーをコンテナで立てる](https://qiita.com/rsakao/items/617f54579278173d3c20)

* [Docker プライベートレジストリからイメージ一覧情報を取得](https://qiita.com/takuyaWt/items/ce846b7f73d8635b5b7b)
