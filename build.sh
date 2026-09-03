#!/bin/bash
set -e
rm -rf dist
mkdir -p dist/dashboard
cp site/index.html dist/index.html
cp dashboard/index.html dist/dashboard/index.html
cp dashboard/ops-status.json dist/dashboard/ops-status.json 2>/dev/null || true
cp site/CNAME dist/CNAME 2>/dev/null || true
