import {prisma} from "./global";
import {Permission} from "./permission";

/**
 * The RoleErrorType enum contains the types of the RoleError class.
 */
enum RoleErrorType {
    ROLE_NOT_FOUND = "Role not found",
    ROLE_ALREADY_EXISTS = "Role already exists",
    ROLE_NAME_REQUIRED = "Role name is required",
    DATABASE_ERROR = "Database error",
}

// The RoleError class extends the Error class and is used to throw Role related errors.
class RoleError extends Error {

    // The type of the error.
    public readonly type: RoleErrorType;

    /**
     * The constructor of the RoleError class.
     * @param type The type of the error.
     * @param message The message of the error.
     */
    constructor(type: RoleErrorType, message: string) {
        // call the super method of the Error class
        super(`${type}: ${message}`);
        // set the type of the error
        this.type = type;
    }
}

// The RoleData interface represents the data of a role.
interface RoleData {
    id: number;
    name: string;
}

// The RolePermissionData interface represents the data of a role permission.
interface RolePermissionData {
    roleId: number;
    permissionName: string;
}

// The Role class represents a role.
class Role implements RoleData {
    get permissions(): Permission[] {
        return this.#permissions;
    }

    set permissions(value: Permission[]) {
        this.#permissions = value;
    }
    get name(): string {
        return this.#name;
    }

    set name(value: string) {
        this.#name = value;
    }
    get id(): number {
        return this.#id;
    }

    set id(value: number) {
        this.#id = value;
    }

    // The id of the role.
    #id: number;
    // The name of the role.
    #name: string;
    // The permissions of the role.
    #permissions: Permission[];

    /**
     * The constructor of the Role class.
     * @param data The data of the role.
     * @param permissions
     */
    constructor(data: RoleData, permissions: Permission[]) {
        // set the id and the name of the role and the permissions
        this.#id = data.id;
        this.#name = data.name;
        this.#permissions = permissions;
    }

    /**
     * A method that returns the role data.
     *
     * @param id The id of the role.
     *
     * @throws {RoleError} if an error occurs while getting the role
     * @throws {PermissionError} if an error occurs while getting the role permissions
     *
     * @returns The role data.
     */
    public static async getRoleById(id: number): Promise<Role> {
        // create a variable to store the role
        let role: RoleData | null;
        // create a variable to store the role permissions
        let rolePermissions: Permission[];

        // try to get the role
        try {
            // store the role in the role variable
            role = await prisma.role.findUnique({
                where: {
                    id: id,
                },
            });
        // if an error occurs
        } catch (error) {
            // throw a new Role error
            throw new RoleError(
                RoleErrorType.DATABASE_ERROR,
                error as string
            );
        }

        // if the role is not found
        if (role === null) {
            // throw a new Role error
            throw new RoleError(
                RoleErrorType.ROLE_NOT_FOUND,
                `The role with the id ${id} was not found`
            );
        }

        // store the role permissions in the rolePermissions variable
        rolePermissions = await Role.getRolePermissions(role.id);

        return new Role(role, rolePermissions);
    }

    /**
     * A method that returns the role data.
     *
     * @param name The name of the role.
     *
     * @throws {RoleError} if an error occurs while getting the role
     * @throws {PermissionError} if an error occurs while getting the role permissions
     *
     * @returns The role data.
     */
    public static async getRoleByName(name: string): Promise<Role> {
        // create a variable to store the role
        let role: RoleData | null;
        // create a variable to store the role permissions
        let rolePermissions: Permission[];

        // try to get the role
        try {
            // store the role in the role variable
            role = await prisma.role.findUnique({
                where: {
                    name: name,
                },
            });
            // if an error occurs
        } catch (error) {
            // throw a new Role error
            throw new RoleError(
                RoleErrorType.DATABASE_ERROR,
                error as string
            );
        }

        // if the role is not found
        if (role === null) {
            // throw a new Role error
            throw new RoleError(
                RoleErrorType.ROLE_NOT_FOUND,
                `The role with the name ${name} was not found`
            );
        }

        // store the role permissions in the rolePermissions variable
        rolePermissions = await Role.getRolePermissions(role.id);

        return new Role(role, rolePermissions);
    }

    /**
     * A method that returns the role data.
     *
     * @throws {PermissionError} if an error occurs while getting the role
     *
     * @returns The role data.
     */
    public static async getRolePermissions(roleId: number): Promise<Permission[]> {
        // create a variable to store the role permissions data
        let rolePermissions: RolePermissionData[] | null;
        let result: Permission[] = [];

        // store the role permissions in the rolePermissions variable
        rolePermissions = await prisma.rolePermission.findMany({
            where: {
                roleId: roleId,
            },
        });

        // for each role permission add the permission to the result array
        for (const rolePermission of rolePermissions) {
            result.push(await Permission.getPermissionByName(rolePermission.permissionName));
        }

        return result;
    }

    /**
     * A method that creates a new role.
     * @param permission The permission to add to the role.
     *
     * @throws {RoleError} if an error occurs while creating the role
     *
     * @returns The created role.
     */
    public async addPermission(permission: Permission): Promise<void> {
        // try to add the permission
        try {
            // store the role permission in the database
            await prisma.rolePermission.create({
                data: {
                    roleId: this.id,
                    permissionName: permission.name,
                },
            });
        // if an error occurs
        } catch (error) {
            // throw a new Role error
            throw new RoleError(
                RoleErrorType.DATABASE_ERROR,
                error as string
            );
        }
    }

    /**
     * A method that creates a new role.
     * @param name The name of the role.
     *
     * @throws {RoleError} if an error occurs while creating the role
     *
     * @returns The created role.
     */
    public static async createRole(name: string): Promise<Role> {
        // create a variable to store the role
        let role: RoleData;

        // if the name is empty
        if (name === "") {
            // throw a new Role error
            throw new RoleError(
                RoleErrorType.ROLE_NAME_REQUIRED,
                "The role name is required"
            );
        }

        let tempRole: Role | null = null;
        // if the role already exists
        try {
            // get the role by name
            tempRole = await Role.getRoleByName(name);
        } catch (error) {
            // if the error is not a role not found error
            if ((error as RoleError).type !== RoleErrorType.ROLE_NOT_FOUND) {
                // throw the error
                throw error;
            }
        }

        // if the role already exists
        if (tempRole !== null) {
            // throw a new Role error
            throw new RoleError(
                RoleErrorType.ROLE_ALREADY_EXISTS,
                `The role with the name ${name} already exists`
            );
        }

        // try to create the role
        try {
            // store the role in the role variable
            role = await prisma.role.create({
                data: {
                    name: name,
                },
            });
            // if an error occurs
        } catch (error) {
            // throw a new Role error
            throw new RoleError(
                RoleErrorType.DATABASE_ERROR,
                error as string
            );
        }

        return new Role(role, []);
    }
}