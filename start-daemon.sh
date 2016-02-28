#! /bin/sh

IPFS=./node_modules/.bin/ipfs

$IPFS init
$IPFS config Addresses.API "/ip4/0.0.0.0/tcp/5001"
API_ORIGIN=* $IPFS daemon
