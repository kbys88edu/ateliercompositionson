# Counterpoint Practice Tools

GitHub Pages にそのままアップロードできる教材ページ一式です。

## 初期パスワード

`login.html` 内の下記を変更してください。

```js
const PASSWORD = "acs-counterpoint-2026";
```

## 配置

このZIPの中身を、GitHubリポジトリのルートにそのままアップロードしてください。

## 注意

このパスワード保護は、GitHub Pages上で動く簡易保護です。
サーバー側認証ではないため、厳密なアクセス制御ではありません。

## 学習記録（study log）

各チェッカーで「解析する」を押すと、課題名・入力した対旋律・禁則/注意/OK の件数が
ブラウザ内（localStorage）に自動で記録されます。`log.html` でその日の記録を一覧し、
PDF 保存（印刷）、テキストコピー、メール共有、JSON 書き出しができます。
共通コードは `js/study-log.js` と `css/study-log.css` です（ear training 側と同じもの）。
