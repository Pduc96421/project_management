const Role = require("../../models/role.model");

const systemConfig = require("../../config/system");

// [Get] /admin/roles
module.exports.index = async (req, res) => {
    const records = await Role.find({
        deleted: false,
    });

    res.render("admin/pages/role/index", {
        pageTitle: "Nhóm quyền",
        records: records,
    });
}

// [Get] /admin/roles/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/role/create", {
        pageTitle: "Nhóm quyền",
    });
}

// [POST] /admin/roles/create
module.exports.createPost = async (req, res) => {
    const record = new Role(req.body);
    await record.save();

    res.redirect(`${systemConfig.prefixAdmin}/roles`);
}

// [Get] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;

        const data = await Role.findOne({
            deleted: false,
            _id: id,
        })

        res.render("admin/pages/role/edit", {
            pageTitle: "Chỉnh sửa phân quyền",
            data: data,
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
}

// [PATCH] /admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
    try {
        const id = req.params.id;

        await Role.updateOne({
            _id: id,
            deleted: false
        }, req.body);

        req.flash("success", "Cập nhật sản phẩm thành công!");
    } catch (error) {
        req.flash("error", "Id sản phẩm không hợp lệ!");
    }

    res.redirect("back");
}

// [Get] /admin/roles/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;

        const data = await Role.findOne({
            deleted: false,
            _id: id,
        })

        res.render("admin/pages/role/detail", {
            pageTitle: data.title,
            data: data,
        });
        
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
}