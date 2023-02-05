#!/bin/bash
wasm-pack build --release --target nodejs && 
cp ../../nexsys-vscode/ ~/.vscode/extensions/ -rf