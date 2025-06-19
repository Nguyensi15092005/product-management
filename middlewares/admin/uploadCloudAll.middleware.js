const uploadToCloudinary = require("../../helper/uploadCloudinary")
// upload nhìu file
module.exports.uploadFields = async (req, res, next) => {
  console.log(req["files"]);
  for (const key in req["files"]) {
    req.body[key] = [];
    const arr = req["files"][key];
    for (const item of arr) {
      try {
        const result = await uploadToCloudinary(item.buffer);
        req.body[key].push(result);
      } catch (error) {
        console.log("Lỗi upload file")
      }
    }
  }
  next();

}

