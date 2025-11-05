/*
  Warnings:

  - Added the required column `ownerId` to the `hotels` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_hotels" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "image" TEXT,
    "ownerId" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "hotels_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_hotels" ("address", "createdAt", "description", "id", "image", "name", "price", "updatedAt") SELECT "address", "createdAt", "description", "id", "image", "name", "price", "updatedAt" FROM "hotels";
DROP TABLE "hotels";
ALTER TABLE "new_hotels" RENAME TO "hotels";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
