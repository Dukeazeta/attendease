# Convex Migration Plan (Local + Production)

## Goals

1. Resolve sign-in instability by removing split auth/data behavior between environments.
2. Migrate from Prisma + SQLite/Turso-style workflows to Convex as the system of record.
3. Keep production available during migration with a rollback path.

## Current State (What we have today)

- Auth uses NextAuth with a Prisma adapter and credential login (`email` + `password`).
- User lookup/password verification happens via `prisma.user.findUnique(...)` and `bcryptjs.compare(...)`.
- Data model currently lives in Prisma schema (`User`, `Course`, `AttendanceSession`, `Attendance`, etc.).
- Local datasource is SQLite in Prisma config, which can diverge from production behavior.

## Target State

- Convex becomes the primary data backend for users, sessions, courses, locations, and attendance records.
- Sign-in reads/writes user/session data through Convex functions.
- Local and prod run the same Convex-backed auth/data flow with only environment-specific secrets.

---

## Phase 0 — Discovery and Freeze (0.5-1 day)

### Tasks

- Inventory all Prisma usage in API routes/server components and classify by domain:
  - Auth critical path
  - Session lifecycle
  - Attendance submission
  - Dashboard/report reads
- Freeze schema-changing work during migration to avoid dual drift.
- Define migration ownership + go/no-go checklist.

### Exit criteria

- A complete endpoint/query map exists.
- Team agrees on cutover window and rollback owner.

---

## Phase 1 — Convex Foundations (1 day)

### Tasks

- Add Convex project setup for:
  - `dev` deployment (local/staging-like)
  - `prod` deployment
- Create base Convex schema/tables mirroring current Prisma models:
  - users
  - courses
  - locations
  - attendanceSessions
  - attendances
  - (auth/session metadata as required by selected auth approach)
- Add typed Convex query/mutation wrappers for each core domain.

### Environment setup

- Local `.env.local` should include Convex deployment URL + anon/admin tokens (as needed).
- Production should have matching env names in Vercel/hosting platform.
- Add startup guard that fails fast when required Convex env vars are missing.

### Exit criteria

- Local app can read/write sample records in Convex.
- CI has a Convex schema/codegen step passing.

---

## Phase 2 — Auth Migration Strategy (critical for sign-in) (1-2 days)

### Recommended direction

Use one of these approaches and commit to one early:

1. **Keep NextAuth, replace Prisma adapter path**
   - Continue credentials provider.
   - Move `authorize()` user lookup to Convex query.
   - Store session state in JWT-only mode (already used) while using Convex for user profile reads.
2. **Adopt Convex-native auth stack** (if desired later)
   - More invasive now; likely slower for immediate sign-in stabilization.

Given current code, option (1) is the fastest low-risk route.

### Tasks

- Build Convex user queries/mutations:
  - `getUserByEmail`
  - `getUserById`
  - `createUser`
  - `updateLastLogin` (optional)
- Update credentials `authorize()` flow to call Convex instead of Prisma.
- Ensure password hashing scheme remains compatible (bcrypt) during migration.
- Keep JWT callbacks (`session`/`jwt`) behavior unchanged to avoid front-end breakage.

### Exit criteria

- Sign-in works locally and in a prod-like environment against Convex-backed users.
- No Prisma reads remain on the login path.

---

## Phase 3 — Data Backfill and Validation (1-2 days)

### Tasks

- Implement one-time migration script:
  - Export Prisma data in dependency order (users -> courses -> locations -> sessions -> attendances).
  - Import into Convex with deterministic ID mapping.
- Add idempotency key/check so reruns are safe.
- Run data parity checks:
  - Row counts per table/collection.
  - Random sample record comparisons.
  - Uniqueness constraint checks (`sessionId+matricNumber`, `sessionId+deviceFingerprint`).

### Exit criteria

- Backfill script can run repeatedly without duplication.
- Parity report passes agreed thresholds.

---

## Phase 4 — Dual Read / Controlled Cutover (1 day)

### Tasks

- Introduce feature flag (`USE_CONVEX_PRIMARY=true|false`).
- For a short period:
  - Writes go to Convex (and optionally shadow-write Prisma for verification).
  - Reads for selected endpoints can compare Convex vs Prisma in logs.
- Cut over read paths in order:
  1. Auth and current user profile
  2. Session listing/details
  3. Attendance submission and reporting

### Monitoring

- Add structured logs around sign-in failures:
  - missing user
  - password mismatch
  - Convex function errors/timeouts
- Add basic auth success/failure dashboard segmented by environment.

### Exit criteria

- Error rate and auth success metrics are stable after cutover window.
- Feature flag defaults to Convex in all environments.

---

## Phase 5 — Decommission Prisma Path (0.5-1 day)

### Tasks

- Remove Prisma adapter/client usage from auth and API routes.
- Remove Prisma migration/runtime dependencies from deploy pipeline.
- Keep archival backup of pre-cutover data dumps.

### Exit criteria

- No runtime imports of `@prisma/client` on active paths.
- Build/deploy works without Prisma requirements.

---

## Local + Prod Runbook

## Local developer flow

1. `convex dev` running.
2. App uses `.env.local` Convex variables.
3. Seed script creates at least one known test user.
4. Smoke test:
   - register (if enabled)
   - login
   - create session
   - submit attendance

## Production rollout flow

1. Deploy Convex schema/functions to prod deployment.
2. Run backfill in dry-run mode and review parity report.
3. Enable `USE_CONVEX_PRIMARY` for a small window (or subset if possible).
4. Monitor sign-in and attendance error rates.
5. Fully enable flag, keep rollback switch for 24-48h.

## Rollback plan

- If auth failure spikes:
  - Flip `USE_CONVEX_PRIMARY=false`.
  - Revert to Prisma-backed reads/writes temporarily.
  - Preserve Convex writes for forensic analysis (do not drop immediately).

---

## Risks and Mitigations

- **Risk:** Password hash mismatch after migration.
  - **Mitigation:** Keep bcrypt verification unchanged; test existing prod hashes in staging copy.
- **Risk:** Data shape mismatch (optional vs required fields).
  - **Mitigation:** Add transform/validation layer in migration script and reject invalid rows with report.
- **Risk:** Divergent local vs prod configs.
  - **Mitigation:** One env var contract shared across environments + startup validation.
- **Risk:** Unique constraint drift in attendance records.
  - **Mitigation:** Enforce composite uniqueness in Convex logic before insert.

---

## Suggested Immediate Next Actions (This week)

1. Implement Phase 0 inventory + endpoint map.
2. Stand up Convex `dev` + `prod` projects and schema skeleton.
3. Move sign-in `authorize()` lookup from Prisma to Convex first (highest pain point).
4. Prepare and test backfill on local copy of production data.
5. Schedule cutover with rollback owner and monitoring checklist.
