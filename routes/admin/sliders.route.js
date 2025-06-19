const express = require("express");
const multer  = require('multer');
const router = express.Router();
const upload = multer();

const controller = require("../../controllers/admin/slider.controller");
const validate = require("../../validates/admin/slider.validate");

const uploadCloud =require("../../middlewares/admin/uploadCloud.middleware");


router.get('/', controller.index);

router.get('/create', controller.create);

router.get('/edit/:id', controller.edit);

router.delete('/delete/:id', controller.delete);


router.post(
    '/create', 
    upload.single("image"),
    uploadCloud.upload,
    validate.createPost, //next
    controller.createPost
)

router.patch(
    '/edit/:id', 
    upload.single("image"),
    uploadCloud.upload,
    validate.createPost, //next
    controller.editPatch);

router.patch('/change-status/:status/:id', controller.ChangeStatus);








module.exports = router;