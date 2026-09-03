#!/bin/bash
set -e
rm -rf dist
mkdir -p dist/dashboard
cp -R site-v2/. dist/
cp dashboard/index.html dist/dashboard/index.html
cp dashboard/ops-status.json dist/dashboard/ops-status.json 2>/dev/null || true
