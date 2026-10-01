const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

function isBcryptHash(password) {
    return /^\$2[aby]\$\d{2}\$/.test(password);
}

async function main() {
    const accounts = await prisma.tAIKHOAN.findMany();

    console.log(`Tìm thấy ${accounts.length} tài khoản.`);

    for (const account of accounts) {
        if (isBcryptHash(account.PASS)) {
            console.log(
                `[SKIP] ${account.MATK} đã được hash.`
            );
            continue;
        }

        const oldPassword = account.PASS.trim();

        const hashedPassword = await bcrypt.hash(
            oldPassword,
            10
        );

        await prisma.tAIKHOAN.update({
            where: {
                MATK: account.MATK
            },
            data: {
                PASS: hashedPassword
            }
        });

        console.log(
            `[OK] Đã hash mật khẩu của ${account.MATK}`
        );
    }

    console.log('Hoàn thành migrate password.');
}

main()
    .catch((error) => {
        console.error(
            'Migrate thất bại:',
            error
        );

        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });