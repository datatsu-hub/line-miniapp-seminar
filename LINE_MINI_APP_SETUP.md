# LINEミニアプリへの公開と設定の手順

LINEミニアプリのチャネル作成まで完了しているとのこと、素晴らしいです！
作成した `index.html` を実際のLINEミニアプリとして動かすためには、**アプリをインターネット上に公開（HTTPS）**し、そのURLをLINEミニアプリの設定に登録する必要があります。

今回は、すでにデータがある **GitHub Pages** を使って無料で公開し、連携させる手順をご案内します。

---

## 1. GitHub Pagesでアプリを公開する

LINEミニアプリの「エンドポイントURL」には、`https://...` で始まる公開サーバーのURLが必要です。

1. ご自身のGitHubリポジトリ（`https://github.com/datatsu-hub/line-miniapp-seminar`）を開きます。
2. 上部メニューの **[Settings] (歯車アイコン)** をクリックします。
3. 左側のサイドバーから **[Pages]** をクリックします。
4. 「Build and deployment」の **[Source]** を `Deploy from a branch` にします。
5. その下の **[Branch]** で `main` を選択し、横にある **[Save]** をクリックします。
6. 数分待ってからページをリロードすると、ページ上部に `Your site is live at https://datatsu-hub.github.io/line-miniapp-seminar/` というURLが表示されます。
   - ※このURLがあなたのWebアプリの公開URLになります。コピーしておいてください。

---

## 2. LINE Developersコンソールでの設定 (LINEミニアプリタブ)

LINEミニアプリチャネルを開き、「LINEミニアプリ」タブで設定を行います。

1. [LINE Developersコンソール](https://developers.line.biz/) にログインし、作成したLINEミニアプリのチャネルを開きます。
2. **「LINEミニアプリ」** タブを開き、**「エンドポイントURL」** の **「編集」** ボタンをクリックします。
3. 以下の設定を入力します：
   - **エンドポイントURL**: 先ほど取得した **GitHub PagesのURL** を入力
     - 例: `https://datatsu-hub.github.io/line-miniapp-seminar/`
4. 入力が完了したら **「更新」** をクリックします。
5. 画面上部に表示されている **「LIFF ID」**（例: `165xxx-xxxx`）と **「LINEミニアプリ URL」**（`https://miniapp.line.me/xxxx`）をメモします。

---

## 3. index.html に LIFF ID を設定する

LINEミニアプリも内部的にはLIFF SDKを利用して動作します。そのため、ソースコード内にメモした「LIFF ID」を設定する必要があります。

1. 手元のPCの `index.html` をエディタで開きます。
2. ソースコードの516行目付近に、以下のような設定箇所があります。
   ```javascript
   // 【設定】LINE Developersコンソールで取得したLIFF IDをここに貼る
   const LIFF_ID = 'ここにあなたのLIFF_IDを貼り付ける';
   ```
3. メモした **LIFF ID** をこの `''` の中に貼り付けて保存します。
4. 変更内容をGitHubにプッシュ（アップロード）します。

---

## 4. スマホのLINEで開いてテストする

1. メモしておいた **「LINEミニアプリ URL」** (`https://miniapp.line.me/xxxx...`) を、自分のスマホのLINEの「Keep」や自分一人のグループトーク等に貼り付けて送信します。
2. そのURLをタップして開きます。
3. 初回の同意画面が出たら「許可する」をタップします。
4. ミニアプリの初期化が成功すると、**LINEのプロフィール名がお名前欄に自動で入力される** ようになります！

これで、ネイティブアプリのような動きをするLINEミニアプリの完成です！
