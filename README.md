# 環境構築方法
まずはこのリポジトリをcloneする。
```
git clone リポジトリのURL
```
## フロントエンド
1. プロジェクトのルートディレクトリにいる状態で以下のコマンドを入力し、node_moduleをインストールする。

    ```
    npm install
    ```

2. サーバーを起動

    ```
    npm run dev
    ```

## バックエンド
0. backendディレクトリ(./backend)に移動
1. pythonのバージョンを合わせる
    - mac: https://qiita.com/shott/items/7c4e1b7c5fb53805685d
    - windowns: 後で書きます
2. 仮想環境を作成（.venvのところは好きなように命名）

    ```
    python3 -m venv .venv
    ```

3. 仮想環境を起動（.venvのところは2で命名したもの）

    - Mac, Linuxの場合
      ```
      source .venv/bin/activate
      ```

    - Windowsの場合
      ```
      source .venv/Scripts/activate
      ```

4. pythonモジュールをインストール

    ```
    pip install -r requirements.txt
    ```

5. サーバー起動
    - Flask or FastAPI 決まり次第追記