---
id: editor-vscode-openwithnewwindow
title: "vscode: いつも新しいウィンドウで起動する"
sidebar_label: "vscode: いつも新しいウィンドウで起動する"
hide_table_of_contents: false
keywords:
  - editor
  - vscode
---

<!-- date: 2021/06/18 -->

# VSCode をいつも新しいウィンドウで起動する

VSCode を使っていると、前回まで使っていたフォルダが記憶されていることがある。

VSCode をいつも新しいウィンドウで起動できる設定を行う。


## 設定方法

以下の2点を設定する必要がある。

1. `window.openWithoutArgumentsInNewWindow` を `on` にする

プロセスが残っているとき、前回のフォルダを記憶しないでウィンドウを起動する設定。


2. `window.restoreWindows` を `none` にする

新しく VScode を起動し直すときに、まっさらなウィンドウで起動するための設定。

新しく VSCode を起動する」とは、プロセスが立ち上がっていないという意味で
Mac でいう、「Command-q で終了した後に、立ち上げる」みたいな状況をさします。


### Setting からの設定

* まず、VSCode を起動し `Settings` を開きます。

![](./media/open_setting.png)

---

* `1. window.openWithoutArgumentsInNewWindow: on` の設定を行います。

* 上の方に検索窓があるので `window.openWithoutArgumentsInNewWindow` の名を参考に検索します。
![](./media/open_without_narguments_in_new_window/01_search.png)

* 設定したい対象の項目が見つかったら `on` にします。
![](./media/open_without_narguments_in_new_window/02_set_on.png)

* `on` になったら設定完了です。
![](./media/open_without_narguments_in_new_window/03_result.png)

---

* 次に `2. window.restoreWindows: none` の設定を行います。

* 同じく、検索窓から `window.restoreWindows` で検索します。
![](./media/restore_windows/01_search.png)

* 設定したい対象の項目が見つかったら `none` にします。
![](./media/restore_windows/02_set_on.png)

* `none` になったら設定完了です。
![](./media/restore_windows/03_result.png)



## 参考
* [VSCode起動時に前回のフォルダを開かない設定にする](https://qiita.com/yanchi4425/items/dd05109ad88e356e57df)
