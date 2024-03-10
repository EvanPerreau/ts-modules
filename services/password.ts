import {compare, hash} from "bcrypt";

/**
 *  An enum that contains the possible errors that can occur while encrypting or verifying a password
**/
enum PasswordErrorType {
    PASSWORD_ENCRYPTION_FAILED = 'Password encryption failed',
    PASSWORD_COMPARISON_FAILED = 'Password decryption failed',
}

/**
 * A class representing the password error.
 */
class PasswordError extends Error {
    // The type of the error.
    public readonly type: PasswordErrorType;

    /**
     * The constructor of the PasswordError class.
     * @param type The type of the error.
     * @param message The message of the error.
     */
    constructor(type: PasswordErrorType, message: string) {
        // call the super method of the Error class
        super(`${type}: ${message}`);
        // set the type of the error
        this.type = type;
    }
}

abstract class Password {
    /**
     * Encrypt a raw password.
     * @param password
     * @private
     *
     * @returns A promise that resolves to the encrypted password
     * @throws {PasswordError} if an error occurs while encrypting the password
     * @example
     * ```ts
     * try {
     *      const hashedPassword = await User.encryptPassword("password");
     *      console.log(hashedPassword);
     *  } catch (e) {
     *      console.error(e);
     *  }
     */
    public static async encryptPassword(password: string): Promise<string> {
        // declare result as a promise that resolves to a string
        let result: Promise<string>;

        // try to encrypt the password
        try {
            // store the hashed password in the result variable
            const hashedPassword = await hash(password, 10);
            result = Promise.resolve(hashedPassword);
        // if an error occurs while encrypting the password
        } catch (error) {
            // throw a new PasswordError
            throw new PasswordError(
                PasswordErrorType.PASSWORD_ENCRYPTION_FAILED,
                error as string,
            );
        }

        return result;
    }

    /**
     * Verify a raw password against a hashed password.
     * @param password
     * @param hashedPassword
     *
     * @returns A promise that resolves to true if the password is valid, false if it is not
     * @throws {PasswordError} if an error occurs while verifying the password
     * @example
     * ```ts
     * try {
     *     const isPasswordValid = await User.verifyPassword("password", "hashedPassword");
     *     console.log(isPasswordValid);
     * } catch (e) {
     *     console.error(e);
     * }
     **/
    public static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
        // declare result as a promise that resolves to a boolean
        let result: Promise<boolean>;

        // try to verify the password
        try {
            // store the result of the password comparison in the result variable
            const isPasswordValid = await compare(password, hashedPassword);
            result = Promise.resolve(isPasswordValid);
        // if an error occurs while verifying the password
        } catch (error) {
            // throw a new PasswordError
            throw new PasswordError(
                PasswordErrorType.PASSWORD_COMPARISON_FAILED,
                error as string,
            );
        }

        return result;
    }
}

export {
    Password,
    PasswordError
};