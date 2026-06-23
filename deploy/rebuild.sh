#!/usr/bin/env bash
# Daily rebuild for kipphard.com, run by cron on the always-on Hetzner box.
#
# Re-renders the static site so date-scheduled blog posts go live on their
# publish date: the build timestamp (__BUILD_TIME__) is the publish cutoff, so
# simply rebuilding each day reveals any posts whose date has arrived. The fresh
# dist/ (including a regenerated sitemap) is then deployed to the nginx webroot.
#
# Source lives at /opt/kipphard.com (rsynced from the author machine, since the
# GitHub repo is private). To publish NEW or edited posts, re-sync that
# directory; the next run picks them up. build:server skips type-checking (the
# source is already checked before it ships) to keep this light on the web host.
set -euo pipefail
export PATH="/usr/bin:/bin"
export VITE_TURNSTILE_SITE_KEY=0x4AAAAAADWwWMF9Q4J3AWTt

cd /opt/kipphard.com
pnpm install --frozen-lockfile >/dev/null 2>&1
pnpm build:server
rsync -a --delete dist/ /var/www/kipphard.com/
echo "[$(date -u +%FT%TZ)] rebuild OK — $(ls dist/blog/*.html 2>/dev/null | wc -l) blog posts live"
