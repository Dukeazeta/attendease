-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Attendance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "matricNumber" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "signedLatitude" REAL NOT NULL,
    "signedLongitude" REAL NOT NULL,
    "deviceFingerprint" TEXT NOT NULL,
    "isManualEntry" BOOLEAN NOT NULL DEFAULT false,
    "signedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Attendance_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "AttendanceSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Attendance" ("deviceFingerprint", "id", "matricNumber", "sessionId", "signedAt", "signedLatitude", "signedLongitude", "studentName") SELECT "deviceFingerprint", "id", "matricNumber", "sessionId", "signedAt", "signedLatitude", "signedLongitude", "studentName" FROM "Attendance";
DROP TABLE "Attendance";
ALTER TABLE "new_Attendance" RENAME TO "Attendance";
CREATE UNIQUE INDEX "Attendance_sessionId_matricNumber_key" ON "Attendance"("sessionId", "matricNumber");
CREATE UNIQUE INDEX "Attendance_sessionId_deviceFingerprint_key" ON "Attendance"("sessionId", "deviceFingerprint");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
