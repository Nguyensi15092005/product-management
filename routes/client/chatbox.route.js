const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/chatbox.controller");

router.post('/chatbox', controller.index)

module.exports = router;