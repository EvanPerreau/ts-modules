import {describe, it} from "node:test";
import assert from "node:assert";
import {Email} from "../services/email";

/**
 * The test suite for the email service.
 */
const test: Promise<void> = describe('Email service', (): void => {

    /**
     * The test case for the Email.validateEmail method.
     */
    describe('Email.validateEmail', (): void => {
        // Test the method with a valid email, should return true.
        it('should validate the email', (): void => {
            assert.strictEqual<boolean>(Email.validateEmail("contact@evan-perreau.fr"), true);
        });
        // Test the method with an invalid email, should return false.
        it('should not validate the email', (): void => {
            // Test the method with an email without the . + domain extension
            assert.strictEqual<boolean>(Email.validateEmail("contact@evan-perreau"), false);
            // Test the method with an email without the "@" and the domain extension
            assert.strictEqual<boolean>(Email.validateEmail("@evan-perreau.fr"), false);
            // Test the method without the name of the domain
            assert.strictEqual<boolean>(Email.validateEmail("contact@.fr"), false);
            // Test the method without the domain extension
            assert.strictEqual<boolean>(Email.validateEmail("contact@evan-perreau."), false);
        });
    });
});

export {
    test
};