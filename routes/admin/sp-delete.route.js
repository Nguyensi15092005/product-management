const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/sp-delete.controller");

router.get('/', controller.index)
router.delete("/delete/:id", controller.deleteItem)
router.patch("/restore/:id", controller.restoreItem)

module.exports = router;