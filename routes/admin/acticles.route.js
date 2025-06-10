const express = require("express");
const multer = require('multer');
const router = express.Router();
const upload = multer();

const controller = require("../../controllers/admin/acticles.controller");
const validate = require("../../validates/admin/article.validate");

const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");


router.get('/', controller.index);

router.get('/create', controller.create);

router.post('/create',
    upload.single("thumbnail"),
    uploadCloud.upload,
    validate.createPost, //next
    controller.createPost
);

router.patch('/change-status/:status/:id', controller.changeStatus);

router.delete('/delete/:id', controller.delete);

router.get('/edit/:id', controller.edit);

router.patch('/edit/:id', 
    upload.single("thumbnail"),
    uploadCloud.upload,
    validate.createPost, //next
    controller.editPatch
);

router.get('/detail/:id', controller.detail);

router.patch('/change-multi', controller.changeMulti);








module.exports = router;