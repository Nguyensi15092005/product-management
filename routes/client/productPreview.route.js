const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/productPreview.controller")

router.post("/",controller.index)




module.exports = router;