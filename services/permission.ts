import {prisma} from "./global";

enum PermissionErrorType {
    PERMISSION_NOT_FOUND = "PERMISSION_NOT_FOUND",
    PERMISSION_ALREADY_EXISTS = "PERMISSION_ALREADY_EXISTS",
    DATABASE_ERROR = "DATABASE_ERROR",
}

// The PermissionError class extends the Error
class PermissionError extends Error {

    // The type of the error.
    public readonly type: PermissionErrorType;

    /**
     * The constructor of the PermissionError class.
     * @param type The type of the error.
     * @param message The message of the error.
     */
    constructor(type: PermissionErrorType, message: string) {
        // call the super method of the Error class
        super(`${type}: ${message}`);
        // set the type of the error
        this.type = type;
    }
}

// The PermissionData interface represents the data of a permission.
interface PermissionData {
    name: string;
}

// The Permission class represents a permission.
class Permission implements PermissionData {
    get name(): string {
        return this.#name;
    }

    set name(value: string) {
        this.#name = value;
    }

    // The name of the permission.
    #name: string;

    /**
     * The constructor of the Permission class.
     * @param name The name of the permission.
     */
    constructor(name: string) {
        this.#name = name;
    }

    /**
     * A method that creates a new permission.
     * @param name The name of the permission.
     *
     * @throws {PermissionError} if an error occurs while creating the permission
     *
     * @returns The created permission.
     */
    public static async getPermissionByName(name: string): Promise<Permission> {
        // declare permission variable to store the result
        let permission: PermissionData | null;

        // try to get the permission
        try {
            // store the permission in the permission variable
            permission = await prisma.permission.findUnique({
                where: {
                    name: name
                }
            });
        // if an error occurs
        } catch (error) {
            // throw a Permission error
            throw new PermissionError(
                PermissionErrorType.DATABASE_ERROR,
                error as string
            );
        }

        // if the permission is not found
        if (permission === null) {
            // throw a Permission error
            throw new PermissionError(
                PermissionErrorType.PERMISSION_NOT_FOUND,
                `Permission with name ${name} not found`
            );
        }

        return new Permission(permission.name);
    }

    /**
     * A method that save a new permission in the database.
     * @param name The name of the permission.
     *
     * @throws {PermissionError} if an error occurs while creating the permission
     *
     * @returns The created permission.
     */
    public static async save(name: string): Promise<Permission> {
        // declare permission variable to store the result
        let permission: PermissionData;

        // try to create the permission
        try {
            // store the created permission in the permission variable
            permission = await prisma.permission.create({
                data: {
                    name: name
                }
            });
        // if an error occurs
        } catch (error) {
            // throw a Permission error
            throw new PermissionError(
                PermissionErrorType.DATABASE_ERROR,
                error as string
            );
        }

        return new Permission(permission.name);
    }

    /**
     * A method that deletes a permission from the database.
     *
     * @throws {PermissionError} if an error occurs while deleting the permission
     */
    public async delete(): Promise<void> {
        // try to delete the permission
        try {
            // delete the permission from the database
            await prisma.permission.delete({
                where: {
                    name: this.name
                }
            });
        // if an error occurs
        } catch (error) {
            // throw a Permission error
            throw new PermissionError(
                PermissionErrorType.DATABASE_ERROR,
                error as string
            );
        }
    }
}

export {
    Permission,
    PermissionError,
    PermissionErrorType,
    PermissionData,
}