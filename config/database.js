
const mongoose = require('mongoose'); // mongoose

//hàm kiểm tra kết nối database
module.exports.connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);// ẩn link mongo để bảo mật ở env
        console.log("Connect Success!")
    } catch (error) {
        console.log("Connect Error!")
        
    }
}
