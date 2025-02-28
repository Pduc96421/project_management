const express = require("express");
const multer = require("multer");
const router = express.Router();

const upload = multer();
const uploadCloud = require("../../middlewares/admin/uploadCloud.middlewares");
const validate = require("../../validates/admin/account.validate");

const controller = require("../../controllers/admin/account.controller");



router.get("/", controller.index);

router.get("/create", controller.create);

router.post(
    "/create",
    upload.single("thumbnail"),
    uploadCloud.upload,
    validate.createPost,
    controller.createPost
);

router.delete("/delete/:id", controller.deleteItem);

router.patch("/change-status/:status/:id", controller.changeStatus);

router.patch("/change-multi", controller.changeMulti);

router.get("/detail/:id", controller.detail);

module.exports = router;