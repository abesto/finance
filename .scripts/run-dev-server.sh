#!/usr/bin/env bash

if ! which meteor > /dev/null; then
    echo "Meteor not found. You can install it by running:"
    echo
    echo "    curl https://install.meteor.com | /bin/sh"
    echo
    exit 1
fi

npm install

cd "$(dirname "${BASH_SOURCE[0]}")/.."
env SKIP_AUTHENTICATION=for-testing meteor
