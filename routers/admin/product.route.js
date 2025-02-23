const express = require("express");
// multer upload anh
const multer = require("multer");

const router = express.Router();
// const storageMulter = require("../../helpers/storageMulter");
// const upload = multer({ storage: storageMulter() });

const upload = multer();

const uploadCloud = require("../../middlewares/admin/uploadCloud.middlewares");


const controller = require("../../controllers/admin/product.controller");

const validate = require("../../validates/admin/product.validate");

router.get("/", controller.index);

router.patch("/change-status/:status/:id", controller.changeStatus);

router.patch("/change-multi", controller.changeMulti);

router.delete("/delete/:id", controller.deleteItem);

router.get("/create", controller.create);

router.post(
    "/create",
    upload.single("thumbnail"),
    uploadCloud.upload,
    validate.createPost, // cần phải đi quan validate(còn gọi là trung gian la --next--)
    controller.createPost
);

router.get("/edit/:id", controller.edit);

router.patch(
    "/edit/:id",
    uploadCloud.upload,
    validate.createPost, // cần phải đi quan validate(còn gọi là trung gian la --next--)
    controller.editPatch
);

router.get("/detail/:id", controller.detail);


module.exports = router;