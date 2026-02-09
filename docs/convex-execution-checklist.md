# Convex Migration Execution Checklist (What to do next)

Use this as the operational runbook to execute the migration in order.

## Step 1 — Create Convex projects (local/dev + prod)

1. Create a Convex project and two deployments (`dev`, `prod`).
2. Save both deployment URLs and deployment tokens.
3. Store secrets in your host (Vercel) for production and `.env.local` for local.

## Step 2 — Standardize environment variables

Add these variables in local and production with the same names:

- `USE_CONVEX_PRIMARY`
- `NEXT_PUBLIC_CONVEX_URL`
- `CONVEX_DEPLOY_KEY`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

If `USE_CONVEX_PRIMARY=true`, fail startup if Convex vars are missing.

## Step 3 — Migrate auth path first

1. Replace Prisma-based user lookup in `authorize()` with Convex query.
2. Keep current bcrypt verification and JWT callbacks unchanged.
3. Remove Prisma adapter dependency from active sign-in path.
4. Test login locally with an existing migrated user.

## Step 4 — Backfill existing data

1. Export users/courses/locations/sessions/attendances in dependency order.
2. Import into Convex with deterministic IDs.
3. Run parity checks:
   - counts
   - random record checks
   - uniqueness checks (`sessionId+matricNumber`, `sessionId+deviceFingerprint`)

## Step 5 — Cut over with safety switch

1. Introduce `USE_CONVEX_PRIMARY` feature flag.
2. Enable Convex reads for auth first.
3. Monitor sign-in success/failure rates for at least one business day.
4. Then migrate sessions and attendance endpoints.

## Step 6 — Rollback readiness

At any sign of auth instability:

1. Set `USE_CONVEX_PRIMARY=false`.
2. Redeploy.
3. Keep Convex writes for diagnostics; do not delete data immediately.

## Step 7 — Decommission Prisma

Only after stability window:

1. Remove runtime Prisma imports from server paths.
2. Remove Prisma adapter from auth config.
3. Remove unused Prisma pipeline steps.

---

## Immediate assignment checklist (today)

- [ ] Owner A: Convex project + env setup.
- [ ] Owner B: Auth migration PR (`src/lib/auth.ts`, register route).
- [ ] Owner C: Backfill script + parity report.
- [ ] Owner D: Monitoring dashboard + rollback drill.
