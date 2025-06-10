const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/product.controller")

router.get('/', controller.index)

router.get('/:slugCategory', controller.category);

router.get('/detail/:slugProduct', controller.detail);

router.patch('/cart/add/:id', controller.addCart);





module.exports = router;