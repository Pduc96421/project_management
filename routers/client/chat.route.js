const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/chat.controller");

const chatMiddlerware = require("../../middlewares/client/chat.middlerware");

router.get("/:roomChatId",chatMiddlerware.isAccess, controller.index);

module.exports = router;