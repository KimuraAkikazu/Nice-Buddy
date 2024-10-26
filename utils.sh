#!/bin/bash

function setup(){
    echo "Frontend install"
    npm install

    echo "backend install"
    python3 -m venv backend/.venv
    source backend/.venv/bin/activate
    pip install -r backend/requirements.txt
    deactivate
}

function start(){
    echo "Frontend start"
    npm run dev -- --port 3000

    echo "Backend start"
    source backend/.venv/bin/activate
    uvicorn backend.main:app --port 8000
}

# テストしてないから後でやる