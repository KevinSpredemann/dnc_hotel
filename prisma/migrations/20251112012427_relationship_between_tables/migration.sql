/*
  Warnings:

  - Added the required column `hotelId` to the `reservations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `reservations` table without a default value. This is not possible if the table is not empty.

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
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "reservations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "reservations_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "hotels" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_reservations" ("approved", "checkIn", "checkOut", "createdAt", "id", "total", "updatedAt") SELECT "approved", "checkIn", "checkOut", "createdAt", "id", "total", "updatedAt" FROM "reservations";
DROP TABLE "reservations";
ALTER TABLE "new_reservations" RENAME TO "reservations";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
