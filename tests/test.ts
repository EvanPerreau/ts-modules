import * as email from "./email";
import * as environment from "./environment";
import * as password from "./password";
import * as token from "./token";
import * as user from "./user";

async function main(): Promise<void> {
    await Promise.all([
        email.test,
        environment.test,
        password.test,
        token.test,
        user.test
    ]);
}