import {describe, it} from "node:test";
import {Role, RoleError, RoleErrorType} from "../services/role";
import assert from "node:assert";
import {Permission} from "../services/permission";

const test: Promise<void> = describe("Role Service", () => {

    /**
     * The test case for the create method.
     */
    describe("Create a new role", () => {
        // test if the role is created
        it("should create a new role", async () => {
            // create a new role
            let role: Role = await Role.create("test_role");
            // test if the role is an instance of the Role class
            assert.strictEqual(role !== null, true);
            // delete the role created for the test
            await role.delete();
        });

        // test if the role already exists
        it("should throw an error if the role already exists", async () => {
            // create a new role
            let role: Role = await Role.create("test_role");
            // try to create the role again
            try {
                // create a new role
                await Role.create("test_role");
                // if the role is created
                assert.fail("Role should not be created");
                // if an error occurs
            } catch (error) {
                // delete the role created for the test
                await role.delete();
                // check if the error is an instance of RoleError
                if (error instanceof RoleError) {
                    // check if the error type is ROLE_ALREADY_EXISTS
                    assert.strictEqual(error.type, RoleErrorType.ROLE_ALREADY_EXISTS);
                } else {
                    // if the error is not an instance of RoleError
                    assert.fail("Error should be an instance of RoleError");
                }
            }
        });

        // Test if the name is invalid
        it("should throw an error if the name is invalid", async () => {
            // try to create a role with an invalid name
            try {
                // create a new role
                await Role.create(" ");
                // if the role is created
                assert.fail("Role should not be created");
                // if an error occurs
            } catch (error) {
                // check if the error is an instance of RoleError
                if (error instanceof RoleError) {
                    // check if the error type is INVALID_ROLE_NAME
                    assert.strictEqual(error.type, RoleErrorType.ROLE_NAME_REQUIRED);
                } else {
                    // if the error is not an instance of RoleError
                    assert.fail("Error should be an instance of RoleError");
                }
            }
        });
    });

    /**
     * The test case for the delete method.
     */
    describe("Delete a role", () => {
        // test if the role is not found
        it("should throw an error if the role is not found", async () => {
            let role: Role = new Role({id: 1, name: "test_role"}, [])
            try {
                // delete the role
                await role.delete();
                // if the role is deleted
                assert.fail("Role should not be deleted");
                // if an error occurs
            } catch (error) {
                // check if the error is an instance of RoleError
                if (error instanceof RoleError) {
                    // check if the error type is DATABASE_ERROR
                    assert.strictEqual(error.type, RoleErrorType.DATABASE_ERROR);
                } else {
                    // if the error is not an instance of RoleError
                    assert.fail("Error should be an instance of RoleError");
                }
            }
        });

        // test if the role is deleted
        it("should delete a role", async () => {
            // create a new role
            let role: Role = await Role.create("test_role");
            // delete the role
            await role.delete();
            // try to get the role by name
            try {
                // get the role by name
                await Role.getRoleByName("test_role");
                // if the role is found
                assert.fail("Role should not be found");
                // if an error occurs
            } catch (error) {
                // check if the error is an instance of RoleError
                if (error instanceof RoleError) {
                    // check if the error type is ROLE_NOT_FOUND
                    assert.strictEqual(error.type, RoleErrorType.ROLE_NOT_FOUND);
                } else {
                    // if the error is not an instance of RoleError
                    assert.fail("Error should be an instance of RoleError");
                }
            }
        });
    });

    /**
     * The test case for the getRoleByName method.
     */
    describe("Get a role by name", () => {
        // test if the role is not found
        it("should throw an error if the role is not found", async () => {
            try {
                // get the role by name
                await Role.getRoleByName("test_role");
                // if the role is found
                assert.fail("Role should not be found");
                // if an error occurs
            } catch (error) {
                // check if the error is an instance of RoleError
                if (error instanceof RoleError) {
                    // check if the error type is ROLE_NOT_FOUND
                    assert.strictEqual(error.type, RoleErrorType.ROLE_NOT_FOUND);
                } else {
                    // if the error is not an instance of RoleError
                    assert.fail("Error should be an instance of RoleError");
                }
            }
        });

        // test if the role is found
        it("should get a role by name", async () => {
            // create a new role
            let role: Role = await Role.create("test_role");
            // get the role by name
            let foundRole: Role = await Role.getRoleByName("test_role");
            // test if the role is an instance of the Role class
            assert.strictEqual(foundRole !== null, true);
            // delete the role created for the test
            await role.delete();
        });
    });

    /**
     * The test case for the getRoleById method.
     */
    describe("Get a role by id", () => {
        // test if the role is not found
        it("should throw an error if the role is not found", async () => {
            try {
                // get the role by id
                await Role.getRoleById(1);
                // if the role is found
                assert.fail("Role should not be found");
                // if an error occurs
            } catch (error) {
                // check if the error is an instance of RoleError
                if (error instanceof RoleError) {
                    // check if the error type is ROLE_NOT_FOUND
                    assert.strictEqual(error.type, RoleErrorType.ROLE_NOT_FOUND);
                } else {
                    // if the error is not an instance of RoleError
                    assert.fail("Error should be an instance of RoleError");
                }
            }
        });

        // test if the role is found
        it("should get a role by id", async () => {
            // create a new role
            let role: Role = await Role.create("test_role");
            // get the role by id
            let foundRole: Role = await Role.getRoleById(role.id);
            // test if the role is an instance of the Role class
            assert.strictEqual(foundRole !== null, true);
            // delete the role created for the test
            await role.delete();
        });
    });

    /**
     * The test case for the addPermission method.
     */
    describe("Add a permission to a role", () => {
        // test if the permission is added
        it("should add a permission to a role", async () => {
            // create a new role
            let role: Role = await Role.create("test_role");
            // create a new permission
            let permission: Permission = await Permission.save("test_permission");
            // add a permission to the role
            await role.addPermission(permission);
            // update the role from the database
            role = await Role.getRoleById(role.id);
            // test if the permission is added to the role
            assert.strictEqual(role.permissions.length, 1);
            // delete the role created for the test
            await permission.delete();
            await role.delete();
        });

        // test if the permission is already added
        it("should throw an error if the permission is already added", async () => {
            // create a new role
            let role: Role = await Role.create("test_role");
            // create a new permission
            let permission: Permission = await Permission.save("test_permission");
            // add a permission to the role
            await role.addPermission(permission);
            // try to add the permission again
            try {
                // add a permission to the role
                await role.addPermission(permission);
                // if the permission is added
                assert.fail("Permission should not be added");
                // if an error occurs
            } catch (error) {
                // delete the role created for the test
                await permission.delete();
                await role.delete();
                // check if the error is an instance of RoleError
                if (error instanceof RoleError) {
                    // check if the error type is DATABASE_ERROR
                    assert.strictEqual(error.type, RoleErrorType.DATABASE_ERROR);
                } else {
                    // if the error is not an instance of RoleError
                    assert.fail("Error should be an instance of RoleError");
                }
            }
        });
    });

    /**
     * The test case for the removePermission method.
     */
    describe("Remove a permission from a role", () => {
        // test if the permission is removed
        it("should remove a permission from a role", async () => {
            // create a new role
            let role: Role = await Role.create("test_role");
            // create a new permission
            let permission: Permission = await Permission.save("test_permission");
            // add a permission to the role
            await role.addPermission(permission);
            // remove a permission from the role
            await role.removePermission(permission);
            // update the role from the database
            role = await Role.getRoleById(role.id);
            // test if the permission is removed from the role
            assert.strictEqual(role.permissions.length, 0);
            // delete the role created for the test
            await permission.delete();
            await role.delete();
        });

        // test if the permission is not found
        it("should throw an error if the permission is not found", async () => {
            // create a new role
            let role: Role = await Role.create("test_role");
            // create a new permission
            let permission: Permission = await Permission.save("test_permission");
            // try to remove a permission that is not added
            try {
                // remove a permission from the role
                await role.removePermission(permission);
                // if the permission is removed
                assert.fail("Permission should not be removed");
                // if an error occurs
            } catch (error) {
                // delete the role created for the test
                await permission.delete();
                await role.delete();
                // check if the error is an instance of RoleError
                if (error instanceof RoleError) {
                    // check if the error type is DATABASE_ERROR
                    assert.strictEqual(error.type, RoleErrorType.DATABASE_ERROR);
                } else {
                    // if the error is not an instance of RoleError
                    assert.fail("Error should be an instance of RoleError");
                }
            }
        });
    });

    /**
     * The test case for the getPermissions method.
     */
    describe("Get the permissions of a role", () => {
        // test if the permissions are found
        it("should get the permissions of a role", async () => {
            // create a new role
            let role: Role = await Role.create("test_role");
            // create a new permission
            let permission: Permission = await Permission.save("test_permission");
            // add a permission to the role
            await role.addPermission(permission);
            // get the permissions of the role
            let permissions: Permission[] = await Role.getPermissions(role.id);
            // test if the permissions are found
            assert.strictEqual(permissions.length, 1);
            // delete the role created for the test
            await permission.delete();
            await role.delete();
        });
    });
});

export {
    test
};