import {Email} from "./email";
import {Password} from "./password";
import {prisma} from "./global";

/**
 * An interface representing the data of a user.
 */
interface UserData {
    id: number;
    name: string;
    email: string;
    password: string;
    // roleId: number;
}

/**
 * An interface representing the data that can be used to create a new user.
 */
interface NewUserData extends Omit<UserData, "id"> {}

/**
 * An interface representing the data that can be used to update a user.
 */
interface UpdateUserData extends Partial<NewUserData> {}

/**
* An interface representing the user credentials.
*/
interface UserCredentials {
    email: string;
    password: string;
}

/**
 * An enum representing the possible errors that can occur while interacting with the user service.
 **/
enum UserErrorType {
    NOT_FOUND = "User not found",
    ALREADY_EXISTS = "User already exists",
    INVALID_PASSWORD = "Invalid password",
    INVALID_EMAIL = "Invalid email",
    DATABASE_ERROR = "Database error",
    INVALID_NAME = "Invalid name",
}

class UserError extends Error {

    // The error type
    public readonly type: UserErrorType;

    /**
     * The constructor of the UserError class.
     * @param type The type of the error.
     * @param message The message of the error.
     */
    constructor(type: UserErrorType, message: string) {
        // call the super method of the Error class
        super(`${type}: ${message}`);
        // set the type of the error
        this.type = type;
    }
}

/**
 * A class representing a user.
 **/
class User implements UserData {
    get password(): string {
        return this.#password;
    }
    set password(value: string) {
        this.#password = value;
    }

    get id(): number {
        return this.#id;
    }
    set id(value: number) {
        this.#id = value;
    }
    get name(): string {
        return this.#name;
    }
    set name(value: string) {
        this.#name = value;
    }
    get email(): string {
        return this.#email;
    }
    set email(value: string) {
        this.#email = value;
    }
    /* get roleId(): number {
        return this.#roleId;
    } */
    /* set roleId(value: number) {
        this.#roleId = value;
    } */

    #id: number;
    #name: string;
    #email: string;
    // #roleId: number;
    #password: string;

    /**
     * Create a new user.
     *
     * @param data - The data for the user
     *
     * @example
     *
     * ```ts
     * const user = new User({
     *     id: 1,
     *     name: "John Doe",
     *     email: "
     *     password: "password",
     *     roleId: 1,
     * });
     *```
     **/
    constructor(data: UserData) {
        this.#id = data.id;
        this.#name = data.name;
        this.#email = data.email;
        // this.#roleId = data.roleId;
        this.#password = data.password;
    }

    /**
     * Get all users from the database.
     *
     * @returns A promise that resolves to an array of users
     *
     * @throws {UserError} if an error occurs while querying the database
     *
     * @example
     *
     * ```ts
     * try {
     * const users = await User.getAll();
     * } catch (e) {
     * console.error(e);
     * }
     * ```
     **/
    public static async getAll(): Promise<UserData[]> {
        // declare the result variable as a promise that resolves to an array of UserData
        let result: Promise<UserData[]>;

        // trying to get all users from the database
        try {
            // store the result of the query in the result variable
            result = prisma.user.findMany();
        // if an error occurs while querying the database
        } catch (error) {
            // throw a new UserError
            throw new UserError(
                UserErrorType.DATABASE_ERROR,
                error as string,
            );
        }

        return result;
    }

    /**
     * Get a new User instance of a database user if exists.
     *
     * @param id - The ID of the user
     *
     * @returns A promise that resolves to a user
     *
     * @throws {UserError} if the user is not found or an error occurs while querying the database
     *
     * @example
     *
     * ```ts
     * try {
     * const user = await User.getById(1);
     * } catch (e) {
     * console.error(e);
     * }
     * ```
     **/
    public static async getById(id: number): Promise<User> {
        // declare the result variable as a promise that resolves to a user
        let result: Promise<User>;
        // declare the user variable to store the user from the database
        let user: UserData | null;

        // trying to get the user from the database
        try {
            // store the result of the query in the user variable
            user = await prisma.user.findUnique({
                where: {
                    id: id
                }
            });
        // if an error occurs while querying the database
        } catch (error) {
            // throw a new UserError
            throw new UserError(
                UserErrorType.DATABASE_ERROR,
                error as string,
            );
        }

        // if the user is not found
        if (user === null) {
            // throw a new UserError
            throw new UserError(
                UserErrorType.NOT_FOUND,
                `User with id ${id} not found`,
            );
        // if the user is found
        } else {
            // assign the user to the result
            result = Promise.resolve(new User(user));
        }

        return result;
    }

    /**
     * Get a new User instance of a database user if exists.
     *
     * @param email - The email of the user
     *
     * @returns A promise that resolves to a user
     *
     * @throws {UserError} if the user is not found or an error occurs while querying the database
     *
     * @example
     *
     * ```ts
     * try {
     * const user = await User.getByEmail("jhondoe@gmail.com");
     * } catch (e) {
     * console.error(e);
     * }
     **/
    public static async getByEmail(email: string): Promise<User> {
        // declare the result variable as a promise that resolves to a user
        let result: Promise<User>;
        // declare the user variable to store the user from the database
        let user: UserData | null;

        // trying to get the user from the database
        try {
            // get user from database
             user = await prisma.user.findUnique({
                where: {
                    email: email
                }
            });

        // if an error occurs while querying the database
        } catch (error) {
            // throw a new UserError
            throw new UserError(
                UserErrorType.DATABASE_ERROR,
                error as string,
            );
        }

        // if the user is not found
        if (user === null) {
            // throw a new UserError
            throw new UserError(
                UserErrorType.NOT_FOUND,
                `User with email ${email} not found`,
            );
        // if the user is found
        } else {
            // assign the user to the result
            result = Promise.resolve(new User(user));
        }

        return result;
    }

    /**
     * Save the user to the database and return a new User instance.
     *
     * @param new_user - The data for the new user
     *
     * @returns A promise that resolves to the user
     *
     * @throws {UserError} if an error occurs
     * @throws {PasswordError} if an error occurs while encrypting the password
     *
     * @example
     *
     * ```ts
     * const  new_user = {
     *     name: "John Doe",
     *     email: "jhondoe@gmail.com",
     *     password: "password",
     *     roleId: 1,
     * };
     *
     * try {
     *  const user = await User.save(new_user);
     * } catch (e) {
     * console.error(e);
     * }
     * ```
     **/
    public static async save(new_user: NewUserData): Promise<User> {
        // declare the result variable as a promise that resolves to a user
        let result: Promise<User>;

        // if the user name is invalid
        if (new_user.name.length < 3) {
            // throw a new UserError
            throw new UserError(
                UserErrorType.INVALID_NAME,
                `Invalid name: ${new_user.name}`,
            );
        }

        // if the user's email is invalid
        if (!Email.validateEmail(new_user.email)) {
            // throw a new UserError
            throw new UserError(
                UserErrorType.INVALID_EMAIL,
                `Invalid email: ${new_user.email}`
            );
        }

        let user_exists: User | null = null;
        // trying to get the user from the database
        try {
            // get user from database
            user_exists = await User.getByEmail(new_user.email);
        // if an error occurs while querying the database -> can be a UserError.NOT_FOUND or UserError.DATABASE_ERROR
        } catch (error) {
            // if the user is not found
            if (!(error instanceof UserError && error.type === UserErrorType.NOT_FOUND)) {
                // throw a new UserError
                throw new UserError(
                    UserErrorType.DATABASE_ERROR,
                    error as string,
                )
            }
        }

        // if the user already exists
        if (user_exists !== null) {
            // throw a new UserError
            throw new UserError(
                UserErrorType.ALREADY_EXISTS,
                `User with email ${new_user.email} already exists`
            );
        }

        // if the new user password is invalid
        if (new_user.password.length < 8) {
            // throw a new UserError
            throw new UserError(
                UserErrorType.INVALID_PASSWORD,
                `Invalid password`,
            );
        }

        // encrypt the user password
        new_user.password = await Password.encryptPassword(new_user.password);

        // trying to save the user to the database
        try {
            // store the result of the query in the user variable
            let user : UserData = await prisma.user.create({
                data: {
                    name: new_user.name,
                    email: new_user.email,
                    password: new_user.password,
                    // roleId: new_user.roleId
                }
            });

            // assign the user to the result
            result = Promise.resolve(new User(user));
        // if an error occurs while querying the database
        } catch (error) {
            // throw a new UserError
            throw new UserError(
                UserErrorType.DATABASE_ERROR,
                error as string,
            );
        }

        return result;
    }

    /**
     * Login the user and return a new User instance.
     *
     * @param credentials - The user credentials
     *
     * @returns A promise that resolves to the user
     *
     * @throws {UserError} if an error occurs
     *
     * @example
     * try {
     *   const user = await User.login({
     *      email: "johndoe@gmail.com",
     *      password: "password",
     *   });
     * } catch (e) {
     *   console.error(e);
     * }
     */
    public static async login(credentials: UserCredentials): Promise<User> {
        // declare the result variable as a promise that resolves to a user
        let result: Promise<User>;
        // declare the user variable to store the user from the database
        let user: UserData | null;

        // trying to get the user from the database
        try {
            // store the result of the query in the user variable
            user = await prisma.user.findUnique({
                where: {
                    email: credentials.email
                }
            });
        // if an error occurs while querying the database
        } catch (error) {
            // throw a new UserError
            throw new UserError(
                UserErrorType.DATABASE_ERROR,
                error as string,
            );
        }

        // if the user is not found
        if (user === null) {
            // throw a new UserError
            throw new UserError(
                UserErrorType.NOT_FOUND,
                `User with email ${credentials.email} not found`
            );
        }

        // if the user's password is invalid
        if (!await Password.verifyPassword(credentials.password, user.password)) {
            // throw a new UserError
            throw new UserError(
                UserErrorType.INVALID_PASSWORD,
                `Invalid password for user with email ${credentials.email}`
            );
        }

        // assign the user to the result
        result = Promise.resolve(new User(user));

        return result;
    }

    /**
     * Update the user in the database.
     *
     * @param data
     *
     * @throws {UserError}
     * @throws {PasswordError}
     *
     * @example
     * ```ts
     * try {
     *    await user.update({
     *    name: "John Doe",
     *    email: "johndoe@gmail.com",
     *    password: "password",
     *    roleId: 1,
     *    });
     *    } catch (e) {
     *    console.error(e);
     *    }
     * ```
     */
    public async update(data: UpdateUserData): Promise<void> {

        // if a new user name is present in the data
        if (data.name) {
            // if the new user name is invalid
            if (data.name.length < 3) {
                // throw a new UserError
                throw new UserError(
                    UserErrorType.INVALID_NAME,
                    `Invalid name: ${data.name}`,
                );
            }
        }

        // if a new user email is present in the data
        if (data.email) {
            // if the new user email is invalid
            if (!Email.validateEmail(data.email)) {
                // throw a new UserError
                throw new UserError(
                    UserErrorType.INVALID_EMAIL,
                    `Invalid email: ${data.email}`,
                );
            // if the new user email is different from the current user email and the new user email already exists
            } else if (data.email !== this.email && await User.getByEmail(data.email) !== null) {
                // throw a new UserError
                throw new UserError(
                    UserErrorType.ALREADY_EXISTS,
                    `User with email ${data.email} already exists`,
                );
            }
        }

        // if a new user password is present in the data
        if (data.password) {
            // if the new user password is invalid
            if (data.password.length < 8) {
                // throw a new UserError
                throw new UserError(
                    UserErrorType.INVALID_PASSWORD,
                    `Invalid password`,
                );
            }

            // encrypt the user password
            data.password = await Password.encryptPassword(data.password);
        }

        // trying to update the user in the database
        try {
            // update the user in the database
            await prisma.user.update({
                where: {
                    id: this.id
                },
                data: data
            });

        // if an error occurs while querying the database
        } catch (error) {
            // throw a new UserError
            throw new UserError(
                UserErrorType.DATABASE_ERROR,
                error as string,
            );
        }

        // if the new user email is present in the data
        if (data.email) {
            // update the email of the user
            this.email = data.email;
        }
        // if the new user name is present in the data
        if (data.name) {
            // update the name of the user
            this.name = data.name;
        }
        // if the new user password is present in the data
        if (data.password) {
            // update the password of the user
            this.password = data.password;
        }
        // if the new user role id is present in the data

        /* if (data.roleId) {
            // update the role id of the user
            this.roleId = data.roleId;
        } */
    }

    /**
     * Delete the user from the database.
     *
     * @throws {UserError}
     *
     * @example
     * ```ts
     * try {
     *    await user.delete();
     *    } catch (e) {
     *    console.error(e);
     *    }
     * ```
     */
    public async delete(): Promise<void> {
        // trying to delete the user from the database
        try {
            // delete the user from the database
            await prisma.user.delete({
                where: {
                    id: this.id
                }
            });
        // if an error occurs while querying the database
        } catch (error) {
            // throw a new UserError
            throw new UserError(
                UserErrorType.DATABASE_ERROR,
                error as string,
            );
        }
    }
}

export {
    User,
    UserError,
    UserErrorType,
    UserData,
    NewUserData,
    UpdateUserData,
};