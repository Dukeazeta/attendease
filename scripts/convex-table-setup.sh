#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   CONVEX_DEPLOY_KEY=... ./scripts/convex-table-setup.sh
# Optional:
#   NEXT_PUBLIC_CONVEX_URL=https://glorious-cardinal-195.eu-west-1.convex.cloud ./scripts/convex-table-setup.sh

if [[ -z "${CONVEX_DEPLOY_KEY:-}" ]]; then
  echo "ERROR: CONVEX_DEPLOY_KEY is required"
  exit 1
fi

# You already shared this deployment URL.
export NEXT_PUBLIC_CONVEX_URL="${NEXT_PUBLIC_CONVEX_URL:-https://glorious-cardinal-195.eu-west-1.convex.cloud}"

echo "Deploying Convex schema/functions to ${NEXT_PUBLIC_CONVEX_URL}"

if ! pnpm exec convex deploy --yes; then
  echo ""
  echo "Convex deploy failed."
  echo "- Verify CONVEX_DEPLOY_KEY is valid for this deployment."
  echo "- Ensure this environment can reach *.convex.cloud over HTTPS."
  exit 1
fi

echo "Done. Current tables are defined in convex/schema.ts"
