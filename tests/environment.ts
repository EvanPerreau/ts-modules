import {describe, it} from "node:test";
import {Environment, EnvironmentError, EnvironmentErrorType} from "../services/environment";
import assert from "node:assert";

/**
 * The test suite for the environment service.
 */
const test: Promise<void> = describe('Environment service', (): void => {

    /**
    * The test case for the Environment class.
    */
    describe('Create a new environment', (): void => {
        // Test the method with a valid environment variable, should return a new environment.
        it('should create a new environment', (): void => {
             // Create a new environment with the TEST environment variable
             let environment: Environment = new Environment(["TEST"]);
             // Test if the environment is not null
             assert.strictEqual(environment !== null, true);
         });
        // Test the method with a missing environment variable, should throw an error.
        it('should throw a EnvironmentErrorType.MISSING_ENV_VARIABLE if a variable is missing', (): void => {
            // Test if the EnvironmentError is thrown
            assert.throws((): void => {
                // Create a new environment with the TOTO environment variable
                new Environment(["TOTO"]);
            // Test if the error is a missing environment variable error
            }, (error: EnvironmentError): boolean => {
                // Test if the error is a missing environment variable error
                return error.type === EnvironmentErrorType.MISSING_ENV_VARIABLE;
            });
        });
    });

    /**
     * The test case for the Environment.get method.
     */
    describe('Get the value of an environment variable', (): void => {
        // Test the method with an existing environment variable, should return the value of the variable.
        it('should return the value of the environment variable', (): void => {
            // Create a new environment with the TEST environment variable
            let environment: Environment = new Environment(["TEST"]);
            // Test if the value of the TEST environment variable is "test"
            assert.strictEqual(environment.get("TEST"), "test");
        });
        // Test the method with a missing environment variable, should throw an error.
        it('should throw a EnvironmentErrorType.MISSING_ENV_VARIABLE if the variable is missing', (): void => {
            // Create a new environment with the TEST environment variable
            let environment: Environment = new Environment(["TEST"]);
            // Test if the EnvironmentError is thrown
            assert.throws((): void => {
                // Test the method with the TOTO environment variable
                environment.get("TOTO");
            // Test if the error is a missing environment variable error
            }, (error: EnvironmentError): boolean => {
                return error.type === EnvironmentErrorType.MISSING_ENV_VARIABLE;
            });
        });
    });
});

export {
    test
}