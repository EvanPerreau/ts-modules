/*
  Warnings:

  - The primary key for the `RolePermission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `permissionId` on the `RolePermission` table. All the data in the column will be lost.
  - The primary key for the `Permission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Permission` table. All the data in the column will be lost.
  - Added the required column `permissionName` to the `RolePermission` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RolePermission" (
    "roleId" INTEGER NOT NULL,
    "permissionName" TEXT NOT NULL,

    PRIMARY KEY ("roleId", "permissionName"),
    CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RolePermission_permissionName_fkey" FOREIGN KEY ("permissionName") REFERENCES "Permission" ("name") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_RolePermission" ("roleId") SELECT "roleId" FROM "RolePermission";
DROP TABLE "RolePermission";
ALTER TABLE "new_RolePermission" RENAME TO "RolePermission";
CREATE TABLE "new_Permission" (
    "name" TEXT NOT NULL
);
INSERT INTO "new_Permission" ("name") SELECT "name" FROM "Permission";
DROP TABLE "Permission";
ALTER TABLE "new_Permission" RENAME TO "Permission";
CREATE UNIQUE INDEX "Permission_name_key" ON "Permission"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
