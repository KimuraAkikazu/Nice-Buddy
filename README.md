# 環境構築方法
まずはこのリポジトリをcloneする。
```
git clone リポジトリのURL
```

## 前提
node.js, (npm), Pythonが事前にローカル環境にインストールされている必要があります。
作成者の環境は以下の様になっています。
- node.js 22.04(LTS)
- Python 3.9.6

    

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
1. 仮想環境を作成（.venvのところは好きなように命名）

    ```
    python3 -m venv .venv
    ```

2. 仮想環境を起動（.venvのところは2で命名したもの）

    - Mac, Linuxの場合
      ```
      source .venv/bin/activate
      ```

    - Windowsの場合
      ```
      source .venv/Scripts/activate
      ```

3. pythonモジュールをインストール

    ```
    pip install -r requirements.txt
    ```

4. サーバー起動
    ```
    uvicorn backend.main:app --port 8000
    ```