-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RolePermission" (
    "roleId" INTEGER NOT NULL,
    "permissionName" TEXT NOT NULL,

    PRIMARY KEY ("roleId", "permissionName"),
    CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "RolePermission_permissionName_fkey" FOREIGN KEY ("permissionName") REFERENCES "Permission" ("name") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_RolePermission" ("permissionName", "roleId") SELECT "permissionName", "roleId" FROM "RolePermission";
DROP TABLE "RolePermission";
ALTER TABLE "new_RolePermission" RENAME TO "RolePermission";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
