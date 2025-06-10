const express = require("express");
const multer  = require('multer')
const router = express.Router();
const upload = multer();

const controller = require("../../controllers/admin/product-category.controller");
const validate = require("../../validates/admin/product-category.validate");
const uploadCloud =require("../../middlewares/admin/uploadCloud.middleware");



router.get('/', controller.index)

router.get('/create', controller.create)

router.post(
    '/create', 
    upload.single("thumbnail"),
    uploadCloud.upload,
    validate.createPost, //next
    controller.createPost
)

router.patch("/change-status/:status/:id", controller.changStatus);

router.delete("/delete/:id", controller.delete);

router.patch("/change-multi", controller.changeMulti);

router.get("/detail/:id", controller.detail);

router.get("/edit/:id", controller.edit);

router.patch(
    '/edit/:id', 
    upload.single("thumbnail"),
    uploadCloud.upload,
    validate.createPost, //next
    controller.editPatch
)







module.exports = router;