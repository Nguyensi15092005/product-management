const express = require("express");
const multer  = require('multer');
const router = express.Router();
const upload = multer();

const controller = require("../../controllers/admin/articles-category.controller");
const uploadCloud =require("../../middlewares/admin/uploadCloud.middleware")
const validate = require("../../validates/admin/article-category.validate");

router.get('/', controller.index);

router.get('/create', controller.create);

router.post(
    '/create',
    upload.single("thumbnail"),
    uploadCloud.upload,
    validate.createPost,
    controller.createPost
);

router.delete('/delete/:id', controller.delete);

router.patch('/change-status/:status/:id', controller.changeStatus);

router.get('/edit/:id', controller.edit);

router.patch(
    '/edit/:id', 
    upload.single("thumbnail"),
    uploadCloud.upload,
    validate.createPost,
    controller.editPatch
);

router.patch('/change-multi', controller.changeMulti);

router.get('/detail/:id', controller.detail);












module.exports = router;