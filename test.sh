#! /bin/sh

set -e

./node_modules/.bin/standard
./node_modules/.bin/mocha --compilers js:babel-register
