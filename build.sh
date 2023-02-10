#!/usr/bin/env bash
set -euo pipefail
zola build && \
  npm run abridge && \
  zola build
