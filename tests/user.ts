import {describe, it} from "node:test";
import {User, UserData, UserError, UserErrorType} from "../services/user";
import assert from "node:assert";

const test: Promise<void> = describe('User service', (): void => {

    /**
     * The test case for the User class.
     */
    describe('Create a new user', (): void => {
        // Test the method with valid parameters, should return a new user.
        it('should create a new user', (): void => {
            // Create a new user with valid parameters
            let user: User = new User({id: 1, name: "Test", email: "test@gmail.com", password: "test"});
            // Test if the user is not null
            assert.strictEqual(user !== null, true);
        });
    });

    /**
     * The test case for the User.save method.
     */
    describe('Save a new user', (): void => {
        // Test the method with valid parameters, should return the new user.
        it('should return the new user', async (): Promise<void> => {
            // Create a new user with valid parameters
            let user: UserData = await User.save({name: "Test", email: "test@gmail.com", password: "testtest"});
            // Test if the user is not null
            assert.strictEqual(user !== null, true);
            // Delete the user created for the test
            await (await User.getByEmail("test@gmail.com")).delete();
        });

        // Test the method with invalid name, should throw an error.
        it('should throw an error for invalid name', async (): Promise<void> => {
            // Create a new user with invalid name
            try {
                // Create a new user with invalid name
                await User.save({name: "a", email: "test@gmail.com", password: "testtest"});
                // If the user is created, the test should fail
                assert.fail("User should not have been created");
                // If the user is not created, the save method should throw an error, we catch it and check the error type
            } catch (error: any) {
                // Check if the error is an instance of UserError
                if (error instanceof UserError) {
                    // Check if the error type is INVALID_NAME
                    assert.strictEqual(error.type, UserErrorType.INVALID_NAME);
                    // if the error is not an instance of UserError
                } else {
                    // The test should fail
                    assert.fail(error.message);
                }
            }
        });

        // Test the method with invalid password, should throw an error.
        it('should throw an error for invalid password', async (): Promise<void> => {
            // Create a new user with invalid password
            try {
                // Create a new user with invalid password
                await User.save({name: "Test", email: "test@gmail.com", password: "test"});
                // If the user is created, the test should fail
                assert.fail("User should not have been created");
                // If the user is not created, the save method should throw an error, we catch it and check the error type
            } catch (error: any) {
                // Check if the error is an instance of UserError
                if (error instanceof UserError) {
                    // Check if the error type is INVALID_PASSWORD
                    assert.strictEqual(error.type, UserErrorType.INVALID_PASSWORD);
                    // if the error is not an instance of UserError
                } else {
                    // The test should fail
                    assert.fail(error.message);
                }
            }
        });

        // Test the method with an existing email, should throw an error.
        it('should throw an error for existing email', async (): Promise<void> => {
            // Create a new user with existing email
            try {
                // Create a new user with existing email
                await User.save({name: "Test", email: "test@gmail.com", password: "testtest"});
                // Create a new user with existing email
                await User.save({name: "Test", email: "test@gmail.com", password: "testtest"});
                // If the user is created, the test should fail
                assert.fail("User should not have been created");
                // If the user is not created, the save method should throw an error, we catch it and check the error type
            } catch (error: any) {
                // Delete the user created for the test
                await (await User.getByEmail("test@gmail.com")).delete();
                // Check if the error is an instance of UserError
                if (error instanceof UserError) {
                    // Check if the error type is DUPLICATE_EMAIL
                    assert.strictEqual(error.type, UserErrorType.ALREADY_EXISTS);
                    // if the error is not an instance of UserError
                } else {
                    // The test should fail
                    assert.fail(error.message);
                }
            }
        });

        // Test the method with invalid email, should throw an error.
        it('should throw an error for invalid email', async (): Promise<void> => {
            // Create a new user with invalid email
            try {
                // Create a new user with invalid email
                await User.save({name: "Test", email: "test", password: "test"});
                // If the user is created, the test should fail
                assert.fail("User should not have been created");
                // If the user is not created, the save method should throw an error, we catch it and check the error type
            } catch (error: any) {
                // Check if the error is an instance of UserError
                if (error instanceof UserError) {
                    // Check if the error type is INVALID_EMAIL
                    assert.strictEqual(error.type, UserErrorType.INVALID_EMAIL);
                    // if the error is not an instance of UserError
                } else {
                    // The test should fail
                    assert.fail(error.message);
                }
            }
        });
    });

    /**
     * The test case for the User.delete method.
     */
    describe('Delete a user', (): void => {
        // Test the method with invalid email, should throw an error.
        it('should throw an error for invalid email', async (): Promise<void> => {
            // Create a new user with valid parameters
            let user = new User({id: 1, name: "Test", email: "test@gmail.com", password: "test"});
            try {
                // Delete the user by email
                await user.delete();
            } catch (error: any) {
                // Check if the error is an instance of UserError
                if (error instanceof UserError) {
                    // Check if the error type is DATABASE_ERROR
                    assert.strictEqual(error.type, UserErrorType.DATABASE_ERROR);
                    // if the error is not an instance of UserError
                } else {
                    // The test should fail
                    assert.fail(error.message);
                }
            }
        });

        // Test the method with valid parameters, should delete the user from the database.
        it('should delete the user from the database', async (): Promise<void> => {
            // Create a new user we want to delete
            await User.save({name: "Test", email: "test@gmail.com", password: "testtest"});
            // Get the user by email and delete it
            await (await User.getByEmail("test@gmail.com")).delete();
            // test if the user is deleted with the getByEmail method and check if the method throws an error
            try {
                // Get the user by email
                await User.getByEmail("test@gmail.com");
                // If the user is found, the test should fail
                assert.fail("User should have been deleted");
                // If the user is not found, the getByEmail method should throw an error, we catch it and check the error type
            } catch (error: any) {
                // Check if the error is an instance of UserError
                if (error instanceof UserError) {
                    // Check if the error type is NOT_FOUND
                    assert.strictEqual(error.type, UserErrorType.NOT_FOUND);
                    // if the error is not an instance of UserError
                } else {
                    // The test should fail
                    assert.fail(error.message);
                }
            }
        });
    });

    /**
     * The test case for the User.getAll method.
     */
    describe('Get all users', async (): Promise<void> => {
        // Test the method with valid parameters, should return all the users.
        await it('should return all the users', async (): Promise<void> => {
            // Create a new user with valid parameters
            let user: UserData[] = await User.getAll();
            // Test if the user is not null
            assert.strictEqual(user !== null, true);
        });
    });

    /**
     * The test case for the User.getByEmail method.
     */
    describe('Get a user by email',  (): void => {
        // Test the method with valid parameters, should return the user.
        it('should return the user', async (): Promise<void> => {
            // Create a user we want to get by email
            await User.save({name: "Test", email: "test@gmail.com", password: "testtest"});
            // Get the user by email and store it in a variable
            let user: User = await User.getByEmail("test@gmail.com");
            // Test if the user is not null
            assert.strictEqual(user !== null, true);
            // Delete the user created for the test
            await user.delete();
        });

        // Test the method with invalid email, should throw an error.
        it('should throw an error for invalid email', async (): Promise<void> => {
           // Get the user by email and check if the method throws an error
            try {
                // Get the user by email
                await User.getByEmail("test");
                // If the user is found, the test should fail
                assert.fail("User should not have been found");
            // If the user is not found, the getByEmail method should throw an error, we catch it and check the error type
            } catch (error: any) {
                // Check if the error is an instance of UserError
                if (error instanceof UserError) {
                    // Check if the error type is INVALID_EMAIL
                    assert.strictEqual(error.type, UserErrorType.NOT_FOUND);
                // if the error is not an instance of UserError
                } else {
                    // The test should fail
                    assert.fail(error.message);
                }
            }
        });
    });

    /**
     * The test case for the User.getById method.
     */
    describe('Get a user by id', (): void => {
        // Test the method with valid parameters, should return the user.
        it('should return the user', async (): Promise<void> => {
            // Create a user we want to get by id
            let user: User = await User.save({name: "Test", email: "test@gmail.com", password: "testtest"});
            // Get the user by id and store it in a variable
            let userById: User = await User.getById(user.id);
            // Test if the user is not null
            assert.strictEqual(userById !== null, true);
            // Delete the user created for the test
            await user.delete();
        });

        // Test the method with invalid id, should throw an error.
        it('should throw an error for invalid id', async (): Promise<void> => {
            // Get the user by id and check if the method throws an error
            try {
                // Get the user by id
                await User.getById(0);
                // If the user is found, the test should fail
                assert.fail("User should not have been found");
            // If the user is not found, the getById method should throw an error, we catch it and check the error type
            } catch (error: any) {
                // Check if the error is an instance of UserError
                if (error instanceof UserError) {
                    // Check if the error type is NOT_FOUND
                    assert.strictEqual(error.type, UserErrorType.NOT_FOUND);
                // if the error is not an instance of UserError
                } else {
                    // The test should fail
                    assert.fail(error.message);
                }
            }
        });

    });

    /**
     * The test case for the User.update method.
     */
    describe('Update a user', (): void => {
        // Test the method with invalid email, should throw an error.
        it('should throw an error for invalid email', async (): Promise<void> => {
            // Create a user we want to update
            await User.save({name: "Test", email: "test@gmail.com", password: "testtest"});
            try {
                // Get the user by email and update the email
                await (await User.getByEmail("test@gmail.com")).update({email: "test"});
                // If the user is updated, the test should fail
                assert.fail("User should not have been updated");
            // If the user is not updated, the update method should throw an error, we catch it and check the error type
            } catch (error: any) {
                // Delete the user created for the test
                await (await User.getByEmail("test@gmail.com")).delete();
                // Check if the error is an instance of UserError
                if (error instanceof UserError) {
                    // Check if the error type is INVALID_EMAIL
                    assert.strictEqual(error.type, UserErrorType.INVALID_EMAIL);
                // if the error is not an instance of UserError
                } else {
                    // The test should fail
                    assert.fail(error.message);
                }
            }
        });

        // Test the method with invalid name, should throw an error.
        it('should throw an error for invalid name', async (): Promise<void> => {
            // Create a user we want to update
            await User.save({name: "Test", email: "test@gmail.com", password: "testtest"});
            try {
                // Get the user by email and update the name
                await (await User.getByEmail("test@gmail.com")).update({name: "a"});
                // If the user is updated, the test should fail
                assert.fail("User should not have been updated");
                // If the user is not updated, the update method should throw an error, we catch it and check the error type
            } catch (error: any) {
                // Delete the user created for the test
                await (await User.getByEmail("test@gmail.com")).delete();
                // Check if the error is an instance of UserError
                if (error instanceof UserError) {
                    // Check if the error type is INVALID_NAME
                    assert.strictEqual(error.type, UserErrorType.INVALID_NAME);
                    // if the error is not an instance of UserError
                } else {
                    // The test should fail
                    assert.fail(error.message);
                }
            }
        });

        // Test the method with invalid password, should throw an error.
        it('should throw an error for invalid password', async (): Promise<void> => {
            // Create a user we want to update
            await User.save({name: "Test", email: "test@gmail.com", password: "testtest"});
            try {
                // Get the user by email and update the password
                await (await User.getByEmail("test@gmail.com")).update({password: "test"});
                // If the user is updated, the test should fail
                assert.fail("User should not have been updated");
                // If the user is not updated, the update method should throw an error, we catch it and check the error type
            } catch (error: any) {
                // Delete the user created for the test
                await (await User.getByEmail("test@gmail.com")).delete();
                // Check if the error is an instance of UserError
                if (error instanceof UserError) {
                    // Check if the error type is INVALID_PASSWORD
                    assert.strictEqual(error.type, UserErrorType.INVALID_PASSWORD);
                    // if the error is not an instance of UserError
                } else {
                    // The test should fail
                    assert.fail(error.message);
                }
            }
        });

        // Test the method with an existing email, should throw an error.
        it('should throw an error for existing email', async (): Promise<void> => {
            // Create a user we want to update
            await User.save({name: "Test", email: "test@gmail.com", password: "testtest"});
            // Create a new user with existing email
            await User.save({name: "Test", email: "exist@gmail.com", password: "testtest"});
            try {
                // Get the user by email and update the email
                await (await User.getByEmail("test@gmail.com")).update({email: "exist@gmail.com"});
                // If the user is updated, the test should fail
                assert.fail("User should not have been updated");
            // If the user is not updated, the update method should throw an error, we catch it and check the error type
            } catch (error: any) {
                // Delete the users created for the test
                await (await User.getByEmail("test@gmail.com")).delete();
                await (await User.getByEmail("exist@gmail.com")).delete();
                // Check if the error is an instance of UserError
                if (error instanceof UserError) {
                    // Check if the error type is ALREADY_EXISTS
                    assert.strictEqual(error.type, UserErrorType.ALREADY_EXISTS);
                    // if the error is not an instance of UserError
                } else {
                    // The test should fail
                    assert.fail(error.message);
                }
            }
        });

        // Test the method with valid parameters, should return the updated user.
        it('should return the updated user', async (): Promise<void> => {
            // Create a user we want to update
            await User.save({name: "Test", email: "test@gmail.com", password: "testtest"});
            // Get the user by email and update the name
            await (await User.getByEmail("test@gmail.com")).update({name: "Test"});
            // Get the user by email and check if the name is updated
            let user: UserData = await User.getByEmail("test@gmail.com");
            // Test if the user is not null
            assert.strictEqual(user.name, "Test");
            // Delete the user created for the test
            await (await User.getByEmail("test@gmail.com")).delete();
        });
    });
});

export {
    test
};