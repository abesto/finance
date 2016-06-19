#!/bin/sh
set -eu

SKIP_AUTHENTICATION=for-testing meteor run | tee meteor.log &
server=$!

echo "--- Starting server PID=$server ---"

trap "kill $server" EXIT TERM KILL

while ! grep "App running at" meteor.log 2>/dev/null >/dev/null; do
    sleep 1;
done

echo "--- Server is up and running, starting tests ---"
mkdir -p $CIRCLE_TEST_REPORTS
./node_modules/.bin/chimp --mocha --mochaReporter=xunit --path=tests --ddp=http://localhost:3000 --log=silent > $CIRCLE_TEST_REPORTS/xunit.xml
retval=$?

echo "--- Done ---"
exit $retval
