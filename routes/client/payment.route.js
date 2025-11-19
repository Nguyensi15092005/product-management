const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/payment.controller");

// router.get("/:orderId", controller.index);

router.post("/create/", controller.createPayment);

router.get("/vnpay", controller.vnpayReturn);

module.exports = router;