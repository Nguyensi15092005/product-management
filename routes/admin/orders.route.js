const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/orders.controller")

router.get('/', controller.index);

router.patch('/change-status/:status/:id', controller.changeStatus);

router.patch('/change-multi', controller.changeMulti);

router.get('/detail/:id', controller.detail);

router.get('/transport', controller.transport);

router.delete('/delete/:id', controller.delete);





module.exports = router;