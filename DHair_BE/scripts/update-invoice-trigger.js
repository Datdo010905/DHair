require('dotenv').config({ quiet: true });
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();
function executeDDL(sql) {
    // Schema engine dùng giao thức phù hợp cho CREATE/DROP TRIGGER;
    // MySQL không hỗ trợ các lệnh này qua prepared statement của Prisma Client.
    execFileSync(process.execPath, [require.resolve('prisma/build/index.js'), 'db', 'execute',
        '--schema', path.join(__dirname, '../prisma/schema.prisma'), '--stdin'],
    { input: sql, cwd: path.join(__dirname, '..'), encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
}
async function main() {
    const triggers = await db.$queryRaw`SHOW TRIGGERS`;
    const existing = triggers.find(item => item.Trigger === 'TRG_TuDongTaoHoaDonTuLichHenDaHoanThanh');
    const backup = path.join(__dirname, '../prisma/invoice-completion-trigger.backup.sql');
    // Giữ bản cũ để khôi phục nếu cập nhật trigger thất bại.
    const restore = existing ? `CREATE TRIGGER TRG_TuDongTaoHoaDonTuLichHenDaHoanThanh ${existing.Timing} ${existing.Event} ON LICHHEN FOR EACH ROW ${existing.Statement}` : null;
    if (restore && !fs.existsSync(backup)) fs.writeFileSync(backup, restore, 'utf8');
    const sql = fs.readFileSync(path.join(__dirname, '../prisma/invoice-completion-trigger.sql'), 'utf8');
    executeDDL('DROP TRIGGER IF EXISTS TRG_TuDongTaoHoaDonTuLichHenDaHoanThanh;');
    try {
        // DDL đọc từ file trong repo, không nhận SQL từ request/client.
        executeDDL(sql);
    } catch (error) {
        if (restore) executeDDL(restore);
        throw error;
    }
    console.log('Đã cập nhật trigger lập hóa đơn; không sửa hóa đơn cũ.');
}
main().catch(error => { console.error(error.message); process.exitCode = 1; }).finally(() => db.$disconnect());
