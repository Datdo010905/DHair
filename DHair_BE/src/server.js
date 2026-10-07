//gọi app.js để run
const app = require('./app');
const { PrismaClient } = require('@prisma/client');
const { startBookingNoShowJob } = require('./jobs/bookingNoShowJob');

//const PORT = 3000;
const PORT = process.env.PORT || 5000;

//run app
const server = app.listen(PORT, '0.0.0.0', () => {
  const jobDatabase = new PrismaClient();
  const stopNoShowJob = startBookingNoShowJob(jobDatabase);
  server.on('close', async () => {
    await stopNoShowJob();
    await jobDatabase.$disconnect();
  });
  console.log(`DHair Barber đang chạy ở cổng ${PORT}!`);
});
