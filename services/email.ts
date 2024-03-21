import {createTransport, Transporter} from "nodemailer";
import {Environment} from "./environment";
import {environment} from "./global";
import SMTPTransport from "nodemailer/lib/smtp-transport";

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

    // Create a new transporter for sending emails, using the environment variables
    private static transporter: Transporter<SMTPTransport.SentMessageInfo> = createTransport({
        host: environment.get("EMAIL_HOST"),
        port: parseInt(environment.get("EMAIL_PORT")),
        // Use `true` for port 465, `false` for all other ports
        secure: environment.get("EMAIL_SECURE") === "true",
        auth: {
            user: environment.get("EMAIL_USER"),
            pass: environment.get("EMAIL_PASSWORD"),
        },
    });

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

    /**
     * Send an email.
     * @param to The email address to send the email to
     * @param from The email address to send the email from
     * @param subject The subject of the email
     * @param text The text of the email
     */
    public static async sendEmail(to: string, from: string, subject: string, text: string): Promise<void> {
        // try to send the email
        try {
            // send the email
            await Email.transporter.sendMail({
                from: from,
                to: to,
                subject: subject,
                text: text,
            });
        } catch (error) {
            // throw a new EmailError
            throw new EmailError(
                EmailErrorType.FATAL_ERROR,
                error as string
            );
        }
    }

    /**
     * Send an HTML email.
     * @param to The email address to send the email to
     * @param from The email address to send the email from
     * @param subject The subject of the email
     * @param html The HTML of the email
     */
    public static async sendHtmlEmail(to: string, from: string, subject: string, html: string): Promise<void> {
        // try to send the email
        try {
            // send the email
            await Email.transporter.sendMail({
                from: from,
                to: to,
                subject: subject,
                html: html,
            });
        } catch (error) {
            // throw a new EmailError
            throw new EmailError(
                EmailErrorType.FATAL_ERROR,
                error as string
            );
        }
    }

}

export {
    Email,
    EmailError,
    EmailErrorType,
}