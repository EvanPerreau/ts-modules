import {describe, it} from "node:test";
import assert from "node:assert";
import {Password, PasswordError, PasswordErrorType} from "../services/password";

/**
 * The test suite for the password service.
 */
const test: Promise<void> = describe('Password service', (): void => {
    /**
     * The test case for the Password.encryptPassword method.
     */
    describe('Encrypt a password', (): void => {
        // Test the method with a valid password, should return the encrypted password.
        it('should return the encrypted password', async (): Promise<void> => {
            // Test if the encrypted password is not null
            assert.strictEqual(await Password.encryptPassword("password") !== null, true);
        });
    });

    /**
     * The test case for the Password.verifyPassword method.
     */
    describe('Verify a password', (): void => {
        // Test the method with a valid password, should return true.
        it('should return true if the password is valid', async (): Promise<void> => {
            // Encrypt the password
            let hashedPassword: string = await Password.encryptPassword("password");
            // Test if the password is valid
            assert.strictEqual(await Password.verifyPassword("password", hashedPassword), true);
        });
        // Test the method with an invalid password, should return false.
        it('should return false if the password is invalid', async (): Promise<void> => {
            // Encrypt the password
            let hashedPassword: string = await Password.encryptPassword("password");
            // Test if the password is invalid
            assert.strictEqual(!await Password.verifyPassword("bad_password", hashedPassword), true);
        });
    });
});

export {
    test,
}