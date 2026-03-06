# LINEミニアプリ（LIFF）公開と設定の手順

チャネル作成まで完了しているとのこと、素晴らしいです！
作成した `index.html` を実際のLINEミニアプリとして動かすためには、**アプリをインターネット上に公開（HTTPS）**し、そのURLをLINEのチャネル設定に登録する必要があります。

今回は、すでにデータがある **GitHub Pages** を使って無料で公開し、連携させる手順をご案内します。

---

## 1. GitHub Pagesでアプリを公開する

LINEミニアプリの「エンドポイントURL（Endpoint URL）」には、`https://...` で始まる公開サーバーのURLが必要です。

1. ご自身のGitHubリポジトリ（`https://github.com/datatsu-hub/line-miniapp-seminar`）を開きます。
2. 上部メニューの **[Settings] (歯車アイコン)** をクリックします。
3. 左側のサイドバーから **[Pages]** をクリックします。
4. 「Build and deployment」の **[Source]** を `Deploy from a branch` にします。
5. その下の **[Branch]** で `main` を選択し、横にある **[Save]** をクリックします。
6. 数分待ってからページをリロードすると、ページ上部に `Your site is live at https://datatsu-hub.github.io/line-miniapp-seminar/` というURLが表示されます。
   - ※このURLがあなたのWebアプリの公開URLになります。コピーしておいてください。

---

## 2. LINE Developersコンソールでの設定

1. [LINE Developersコンソール](https://developers.line.biz/) にログインし、作成したチャネルを開きます。
2. **「LIFF」** タブを開き、**「追加」** ボタンをクリックします。
3. 以下の設定を入力します：
   - **LIFFアプリ名**: 任意（例：予約ミニアプリ）
   - **サイズ**: `Full` を推奨 (画面全体を使用)
   - **エンドポイントURL**: 先ほど取得した **GitHub PagesのURL** を入力
     - 例: `https://datatsu-hub.github.io/line-miniapp-seminar/`
   - **Scope**: `profile` にチェックを入れる（LINEのユーザー名を取得するため）
   - **ボットリンク機能**: お好みで設定 (通常は `Off` などを選択)
4. 入力が完了したら **「追加」** をクリックします。
5. 作成されたLIFFの **「LIFF ID」**（例: `165xxx-xxxx`）と **「LIFF URL」**（`https://liff.line.me/xxxx`）が発行されるので、両方をメモします。

---

## 3. index.html に LIFF ID を設定する

LIFFアプリとして動かすために、ソースコード内に「LIFF ID」を設定する必要があります。

1. 手元のPCの `index.html` をエディタで開きます。
2. 今回すでに追加したコードの523行目付近に、以下のような設定箇所があります。
   ```javascript
   // 【設定】LINE Developersコンソールで取得したLIFF IDを入力してください
   const LIFF_ID = 'ここにあなたのLIFF_IDを貼り付ける';
   ```
3. メモした **LIFF ID** をこの `''` の中に貼り付けて保存し、GitHubにプッシュ（アップロード）します。

---

## 4. スマホのLINEで開いてテストする

1. 先ほど発行された **「LIFF URL」** (`https://liff.line.me/165xxx...`) を、自分のスマホのLINEの「Keep」や自分一人のグループトーク等に貼り付けて送信します。
2. そのURLをタップして開きます。
3. 初回は「認証画面」が出ますので、「許可する」をタップします。
4. LIFFの初期化が成功すると、**LINEのプロフィール名がお名前欄に自動で入力される** ようになります！

これで、立派なLINEミニアプリとして動作するようになります！
