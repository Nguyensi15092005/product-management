const express = require("express");
const multer = require('multer');
const router = express.Router();
const upload = multer();

const controller = require("../../controllers/admin/settings-general.controller")
const uploadCloud = require("../../middlewares/admin/uploadCloudAll.middleware")


router.get('/general', controller.general);

router.patch(
    '/general',
    upload.fields([
        { name: 'logo', maxCount: 1 },
        { name: 'image_slider_right_top', maxCount: 1},
        { name: 'image_slider_right_bottom', maxCount: 1},
    ]), 
    uploadCloud.uploadFields,
    controller.generalPatch
);


module.exports = router;