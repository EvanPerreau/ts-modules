import {describe, it} from "node:test";
import {Permission, PermissionError, PermissionErrorType} from "../services/permission";
import assert from "node:assert";

const test: Promise<void> = describe("Permission Service", () => {

    /**
     * The test case for the save method.
     */
    describe("Save a new permission", () => {
        // test if the permission is saved
        it("should save a new permission", async () => {
            // create a new permission
            let permission: Permission = await Permission.save("test_permission");
            // test if the permission is an instance of the Permission class
            assert.strictEqual(permission !== null, true);
            // delete the permission created for the test
            await permission.delete();
        });

        // test if the permission already exists
        it("should throw an error if the permission already exists", async () => {
            // create a new permission
            let permission: Permission = await Permission.save("test_permission");
            // try to create the permission again
            try {
                // create a new permission
                await Permission.save("test_permission");
                // if the permission is created
                assert.fail("Permission should not be created");
                // if an error occurs
            } catch (error) {
                // delete the permission created for the test
                await permission.delete();
                // check if the error is an instance of PermissionError
                if (error instanceof PermissionError) {
                    // check if the error type is PERMISSION_ALREADY_EXISTS
                    assert.strictEqual(error.type, PermissionErrorType.PERMISSION_ALREADY_EXISTS);
                } else {
                    // if the error is not an instance of PermissionError
                    assert.fail("Error should be an instance of PermissionError");
                }
            }
        });
    });

    /**
     * The test case for the delete method.
     */
    describe("Delete a permission", () => {
        // test if the permission is not found
        it("should throw an error if the permission is not found", async () => {
            let permission: Permission = new Permission("test_permission")
            try {
                // delete the permission
                await permission.delete();
                // if the permission is deleted
                assert.fail("Permission should not be deleted");
                // if an error occurs
            } catch (error) {
                // check if the error is an instance of PermissionError
                if (error instanceof PermissionError) {
                    // check if the error type is DATABASE_ERROR
                    assert.strictEqual(error.type, PermissionErrorType.DATABASE_ERROR);
                } else {
                    // if the error is not an instance of PermissionError
                    assert.fail("Error should be an instance of PermissionError");
                }
            }
        });

        // test if the permission is deleted
        it("should delete a permission", async () => {
            // create a new permission
            let permission: Permission = await Permission.save("test_permission");
            // delete the permission
            await permission.delete();
            // try to get the permission by name
            try {
                // get the permission by name
                await Permission.getPermissionByName("test_permission");
                // if the permission is found
                assert.fail("Permission should not be found");
                // if an error occurs
            } catch (error) {
                // check if the error is an instance of PermissionError
                if (error instanceof PermissionError) {
                    // check if the error type is PERMISSION_NOT_FOUND
                    assert.strictEqual(error.type, PermissionErrorType.PERMISSION_NOT_FOUND);
                } else {
                    // if the error is not an instance of PermissionError
                    assert.fail("Error should be an instance of PermissionError");
                }
            }
        });
    });

    /**
     * The test case for the getPermissionByName method.
     */
    describe("Get a permission by name", () => {
        // test if the permission is not found
        it("should throw an error if the permission is not found", async () => {
            try {
                // get the permission by name
                await Permission.getPermissionByName("test_permission");
                // if the permission is found
                assert.fail("Permission should not be found");
                // if an error occurs
            } catch (error) {
                // check if the error is an instance of PermissionError
                if (error instanceof PermissionError) {
                    // check if the error type is PERMISSION_NOT_FOUND
                    assert.strictEqual(error.type, PermissionErrorType.PERMISSION_NOT_FOUND);
                } else {
                    // if the error is not an instance of PermissionError
                    assert.fail("Error should be an instance of PermissionError");
                }
            }
        });

        // test if the permission is found
        it("should get a permission by name", async () => {
            // create a new permission
            let permission: Permission = await Permission.save("test_permission");
            // get the permission by name
            let permission_found: Permission = await Permission.getPermissionByName("test_permission");
            // test if the permission is an instance of the Permission class
            assert.strictEqual(permission_found !== null, true);
            // delete the permission created for the test
            await permission.delete();
        });
    });
});

export {
    test
};