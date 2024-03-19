-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Permission" (
    "name" TEXT NOT NULL PRIMARY KEY
);
INSERT INTO "new_Permission" ("name") SELECT "name" FROM "Permission";
DROP TABLE "Permission";
ALTER TABLE "new_Permission" RENAME TO "Permission";
CREATE UNIQUE INDEX "Permission_name_key" ON "Permission"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
