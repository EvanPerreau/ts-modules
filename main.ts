import * as global from "./services/global";

async function main() {

}

main()
    .catch(e => {
        throw e;
    })
    .finally(async () => {
        await global.prisma.$disconnect();
    })