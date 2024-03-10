/**
 * Enum representing the possible email errors.
 */
enum EmailErrorType {
    FATAL_ERROR = "Fatal error",
}

/**
 * A class representing the email error.
 */
class EmailError extends Error {

    // The type of the error.
    public readonly type: EmailErrorType;

    /**
     * The constructor of the EmailError class.
     * @param type The type of the error.
     * @param message The message of the error.
     */
    constructor(type: EmailErrorType, message: string) {
        // call the super method of the Error class
        super(`${type}: ${message}`);
        // set the type of the error
        this.type = type;
    }
}

/**
 * A class that represents the email service.
 */
abstract class Email {
    /**
     * Validate an email address.
     * @param email
     *
     * @throws {EmailError} if an error occurs while validating the email
     *
     * @returns A promise that resolves to true if the email is valid, false if it is not
     * @example
     * ```ts
     *  if (Email.validateEmail("jhondoe@gmail.com")) {
     *    console.log("Email is valid");
     * } else {
     *    console.error("Email is invalid");
     * }
     *  ```
     *  **/
    public static validateEmail(email: string): boolean {
        // declare result as a promise that resolves to a boolean
        let result: boolean;

        // try to validate the email
        try {
            // check if the email is more than 100 characters or does not match the email regex
            result = email.length < 100 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        // if an error occurs while validating the email
        } catch (error) {
            // throw a new EmailError
            throw new EmailError(
                EmailErrorType.FATAL_ERROR,
                error as string
            );
        }

        return result;
    }
}

export {
    Email,
    EmailError,
    EmailErrorType,
}