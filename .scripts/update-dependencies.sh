#!/usr/bin/env bash

set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."
meteor update
meteor npm update --ignore-shrinkwrap --save
meteor npm shrinkwrap