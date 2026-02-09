# Phase 0 Inventory: Prisma Usage Map

This inventory is the concrete starting point for migration. Use it to move the highest-risk paths first.

## 1) Authentication (migrate first)

- `src/lib/auth.ts`
  - NextAuth is configured with `PrismaAdapter(prisma)`.
  - Credentials authorize path reads user via Prisma.
- `src/app/api/auth/register/route.ts`
  - Registration checks existing user and creates user with Prisma.

## 2) Attendance signing flow (production-critical)

- `src/app/attend/[code]/page.tsx`
  - Share-code lookups for active session.
- `src/app/api/attend/route.ts`
  - Session lookup.
  - Duplicate checks by matric number and device fingerprint.
  - Attendance insert.

## 3) Session management

- `src/app/sessions/page.tsx`
- `src/app/sessions/[id]/page.tsx`
- `src/app/sessions/new/page.tsx`
- `src/app/api/sessions/route.ts`
- `src/app/api/sessions/[id]/attendance/route.ts`
- `src/app/api/sessions/[id]/attendance/[attendanceId]/route.ts`

## 4) Dashboard, courses, locations

- `src/app/dashboard/page.tsx`
- `src/app/courses/page.tsx`
- `src/app/locations/page.tsx`
- `src/app/api/locations/route.ts`
- `src/app/api/locations/[id]/route.ts`

## 5) Health checks

- `src/app/api/health/route.ts`
  - Current health endpoint depends on Prisma user count.

---

## Migration Order (recommended)

1. Auth (`src/lib/auth.ts`, register route)
2. Attend public sign endpoint (`api/attend`) and attend page lookup
3. Session lifecycle endpoints/pages
4. Dashboard/courses/locations
5. Health endpoint

---

## Definition of done for Phase 0

- [ ] Every file above has a Convex counterpart ticket.
- [ ] Owner assigned for each migration group.
- [ ] Auth migration window scheduled first.
- [ ] Rollback owner assigned for cutover.
