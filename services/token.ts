import {environment} from "./global";
import jwt from "jsonwebtoken";

/**
 * An enum that represents the possible errors of the Jwt class.
 */
enum TokenErrorType {
    TOKEN_GENERATION_ERROR = "Token generation error",
    TOKEN_VERIFICATION_ERROR = "Token verification error",
}

/**
 * A class that represents the token error.
 */
class TokenError extends Error {

    // The type of the error.
    public readonly type: TokenErrorType;

    /**
     * The constructor of the TokenError class.
     * @param type The type of the error.
     * @param message The message of the error.
     */
    constructor(type: TokenErrorType, message: string) {
        // call the super method of the Error class
        super(`${type}: ${message}`);
        // set the type of the error
        this.type = type;
    }
}

/**
 * A class that represents the Jwt service.
 */
abstract class Token {
    // The secret key used to sign the tokens.
    private static _secret: string = environment.get('SECRET_KEY');

    /**
     * A method that generates an authentication token.
     * @param payload The payload of the token.
     * @param expTime The expiration time of the token.
     *
     * @throws {TokenError} if an error occurs while generating the token
     *
     * @returns The generated token.
     */
    public static generate<T extends Object>(payload: T, expTime: string | number): string {
        // declare a variable to store the result
        let result: string;

        // try to generate the token
        try {
            // store the generated token in the result variable
            result = jwt.sign(payload, this._secret, {expiresIn: expTime});
        // if an error occurs
        } catch (error) {
            // throw a Token error
            throw new TokenError(
                TokenErrorType.TOKEN_GENERATION_ERROR,
                error as string
            );
        }

        return result;
    }

    /**
     * A method that verifies an authentication token.
     * @param token The token to verify.
     *
     * @throws {TokenError} if an error occurs while verifying the token
     *
     * @returns The payload of the token.
     */
    public static verify<T extends Object>(token: string): T {
        // declare a variable to store the result
        let result: T;

        // try to verify the token
        try {
            // store the payload of the token in the result variable
            result = jwt.verify(token, this._secret) as T;
        // if an error occurs
        } catch (error) {
            // throw a Token error
            throw new TokenError(
                TokenErrorType.TOKEN_VERIFICATION_ERROR,
                error as string
            );
        }

        return result;
    }
}

export {
    Token,
    TokenError,
    TokenErrorType,
};