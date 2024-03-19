import {describe, it} from "node:test";
import assert from "node:assert";
import {Token, TokenError, TokenErrorType} from "../services/token";

/**
 * The test suite for the token service.
 */
const test: Promise<void> = describe('Token service', (): void => {

    // The payload of the token.
    interface Payload {
        id: number;
        iat?: number;
        exp?: number;
    }

    /**
     * The test case for the Token.generate method.
     */
    describe('Generate a new token', (): void => {
        // Test the method with a valid payload and expiration time, should return a new token.
        it('should generate a new token', (): void => {
            // Generate a new token with the payload and expiration time
            let token: string = Token.generate<Payload>({id: 1}, "1h");
            // Test if the token is not null
            assert.strictEqual(token !== null, true);
        });
    });

    /**
     * The test case for the Token.verify method.
     */
    describe('Verify an authentication token', (): void => {
        // Test the method with a valid token, should return the payload of the token.
        it('should verify the token', (): void => {
            // Generate a new token with the payload and expiration time
            let token: string = Token.generate<Payload>({id: 1}, "1h");
            // Test if the payload of the token is the same as the payload used to generate the token
            assert.strictEqual(Token.verify<Payload>(token).id, 1);
        });
        // Test the method with an expired token, should throw an error.
        it('should throw a TokenErrorType.TOKEN_VERIFICATION_ERROR if the token is expired', (): void => {
            // Generate a new token with the payload and expiration time
            let token: string = Token.generate<Payload>({id: 1}, "1ms");
            // Test if the TokenError is thrown
            assert.throws((): void => {
                // Test the method with the expired token
                Token.verify<Payload>(token);
            // Test if the error is a token verification error
            }, (error: TokenError): boolean => {
                return error.type === TokenErrorType.TOKEN_VERIFICATION_ERROR;
            });
        });
    });
});

export {
    test
};