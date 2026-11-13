#!/usr/bin/env bash
set -euo pipefail
# Run on a machine with GitHub network access and Node.js >= 22.20.
# Install via the user-owned GitHub fork. Review changes and upstream license before commit.
cd "$(dirname "$0")/.."
node -e "let v=process.versions.node.split('.').map(Number); if(v[0]<22||(v[0]===22&&v[1]<20))throw new Error('Need Node.js >=22.20');"
npx --yes skills add huowu666-ops/awesome-gamedev-agent-skills -a codex --copy -y
printf '
Installed skills under project agent directory. Review changes before committing.
'
