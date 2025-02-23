const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/dasboard.controller");

router.get("/", controller.dasboard);

module.exports = router;