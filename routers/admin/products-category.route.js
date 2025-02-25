const express = require("express");
// multer upload anh
const multer = require("multer");
const router = express.Router();

const controller = require("../../controllers/admin/product-category.controller");
const validate = require("../../validates/admin/product-category.validate");
const upload = multer();
const uploadCloud = require("../../middlewares/admin/uploadCloud.middlewares");


router.get("/", controller.index);

router.patch("/change-status/:status/:id", controller.changeStatus);

router.delete("/delete/:id", controller.deleteItem);

router.patch("/change-multi", controller.changeMulti);

router.get("/create", controller.create);

router.get("/edit/:id", controller.edit);

router.patch(
    "/edit/:id",
    upload.single("thumbnail"),
    uploadCloud.upload,
    validate.createPost,
    controller.editPatch
);

router.post(
    "/create",
    upload.single("thumbnail"),
    uploadCloud.upload,
    validate.createPost,
    controller.createPost
);

module.exports = router;