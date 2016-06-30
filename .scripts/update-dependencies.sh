#!/usr/bin/env bash

set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."
meteor update
npm update --ignore-shrinkwrap --save
npm shrinkwrap