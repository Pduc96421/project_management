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

//[DELETE] /adim/products/delete/:id 
module.exports.deleteItem = async (req, res) => {
    // console.log(req.params);// in ra status vs id (trong route cua url)
    const id = req.params.id;

    await Role.deleteOne({
        _id: id
    }); // xoa cung
    // await Product.updateOne({
    //     _id: id
    // }, {
    //     deleted: true,
    //     deletedAt: new Date()
    // }); // xoa mem

    req.flash("success", "Đã xóa thành công!");

    res.redirect("back");
};

// [GET] /admin/roles/permissions
module.exports.permissions = async (req, res) => {

    const records = await Role.find({
        deleted: false,
    });

    res.render("admin/pages/role/permission", {
        pageTitle: "Phân quyền",
        records: records,
    });
}

// [PATCH}] /admin/roles/permissions
module.exports.permissionsPatch = async (req, res) => {
    const permissions = JSON.parse(req.body.permissions);

    for (const item of permissions){
        const id = item.id;
        const permissions = item.permissions;
        await Role.updateOne({ _id: id }, { permissions: permissions });
    }

    req.flash("success", "Cập nhập phân quyền thành công");

    res.redirect("back")
}