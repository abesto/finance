#!/usr/bin/env bash

cd "$(dirname "${BASH_SOURCE[0]}")/.."
./node_modules/.bin/chimp .config/chimp.js
