/*
  Warnings:

  - You are about to drop the column `approved` on the `reservations` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_reservations" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "hotelId" INTEGER NOT NULL,
    "total" REAL NOT NULL,
    "checkIn" DATETIME NOT NULL,
    "checkOut" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "reservations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "reservations_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "hotels" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_reservations" ("checkIn", "checkOut", "createdAt", "hotelId", "id", "total", "updatedAt", "userId") SELECT "checkIn", "checkOut", "createdAt", "hotelId", "id", "total", "updatedAt", "userId" FROM "reservations";
DROP TABLE "reservations";
ALTER TABLE "new_reservations" RENAME TO "reservations";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
