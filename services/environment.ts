/**
 * An enum that represents the different types of errors that can occur when using the Environment class.
 */
enum EnvironmentErrorType {
    MISSING_ENV_VARIABLE = 'MISSING_ENV_VARIABLE',
    MISSING_ENV_FILE = 'MISSING_ENV_FILE',
}

class EnvironmentError extends Error {
    // The type of the error.
    public readonly type: EnvironmentErrorType;

    /**
     * The constructor of the EnvironmentError class.
     * @param type The type of the error.
     * @param message The message of the error.
     */
    constructor(type: EnvironmentErrorType, message: string) {
        // call the super method of the Error class
        super(`${type}: ${message}`);
        // set the type of the error
        this.type = type;
    }
}

/**
 * An interface that represents an environment variable.
 */
type EnvironmentVariable = {
    name: string;
    value: any;
}

/**
 * A class that represents the environment variables of the application.
 */
class Environment {

    // An array of environment variables.
    #variables: EnvironmentVariable[] = [];

    /**
     * The constructor of the Environment class.
     * @param variables An array of environment variables.
     *
     * @throws {EnvironmentError} if an error occurs while creating the environment
     **/
    constructor(variables: string[]) {
        // test if the .env file exists
        try {
            require('dotenv').config();
        // if the env is not defined
        } catch (error) {
            // throw a new Environment error
            throw new EnvironmentError(
                EnvironmentErrorType.MISSING_ENV_FILE,
                error as string);
        }

        // for each variable in the variables array
        variables.forEach((variable) => {
            // if the variable is not defined in the environment
            if (!process.env[variable]) {
                // throw a new Environment error
                throw new EnvironmentError(
                    EnvironmentErrorType.MISSING_ENV_VARIABLE,
                    `The environment variable ${variable} is missing`
                );
            // if the variable is defined in the environment
            } else {
                // add the variable to the _variables array
                this.#variables.push({
                    name: variable,
                    value: process.env[variable],
                });
            }
        });
    }

    /**
     * A method that returns the value of an environment variable.
     * @param name The name of the environment variable.
     *
     * @throws {EnvironmentError} if the environment variable is missing
     *
     * @returns The value of the environment variable.
     **/
    public get(name: string): string {
        // find the variable with the given name in the _variables array
        const variable = this.#variables.find((variable) => variable.name === name);
        // if the variable is not found
        if (!variable) {
            // throw a new Environment error
            throw new EnvironmentError(
                EnvironmentErrorType.MISSING_ENV_VARIABLE,
                `The environment variable ${name} is missing`
            );
        }
        // return the value of the variable
        return variable.value;
    }
}

export {
    Environment,
    EnvironmentError,
    EnvironmentErrorType,
    EnvironmentVariable,
};