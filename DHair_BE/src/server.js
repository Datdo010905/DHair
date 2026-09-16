//gọi app.js để run
const app = require('./app'); 

//const PORT = 3000;
const PORT = process.env.PORT || 5000;

//run app
app.listen(PORT, () => {
    console.log(`DHair Barber đang chạy ở cổng ${PORT}!`);
});