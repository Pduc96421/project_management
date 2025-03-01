const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");
const md5 = require("md5");

//[Get] /admin/accounts
module.exports.index = async (req, res) => {
    let find = {
        deleted: false,
    }

    const records = await Account.find(find).select("-password -token");

    for (const record of records) {
        const role = await Role.findOne({
            _id: record.role_id,
            deleted: false,
        });
        record.roleTitle = role.title;
    }

    res.render("admin/pages/accounts/index", {
        pageTitle: "Danh sách tải khoản",
        records: records,
    });
}

//[Get] /admin/accounts/create
module.exports.create = async (req, res) => {
    const roles = await Role.find({
        deleted: false,
    });

    res.render("admin/pages/accounts/create", {
        pageTitle: "Tạo mới tài khoản",
        roles: roles,
    });
}

//[POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
    const emailExist = await Account.findOne({
        email: req.body.email,
        deleted: false,
    });

    if (emailExist) {
        req.flash("error", `Email ${req.body.email} đã tồn tại`);
        res.redirect("back");
    } else {
        req.body.password = md5(req.body.password);

        const records = new Account(req.body);
        await records.save();

        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }
}

//[DELETE] /admin/accounts/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;

    await Account.deleteOne({
        _id: id
    });

    req.flash("success", "Đã xóa thành công!");

    res.redirect("back");
}

//[PATCH] /admin/accounts/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;

    await Account.updateOne({
        _id: id
    }, {
        status: status
    }, );

    req.flash("success", "Cập nhập trạng thái thành công!");

    res.redirect("back");
}

//[PATCH] /admin/accounts/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");

    switch (type) {
        case "active":
            await Account.updateMany({
                _id: {
                    $in: ids
                }
            }, {
                status: "active"
            });
            req.flash("success", `cập nhập trạng thái thành công ${ids.length} sản phẩm!`);
            break;
        case "inactive":
            await Account.updateMany({
                _id: {
                    $in: ids
                }
            }, {
                status: "inactive"
            });
            req.flash("success", `cập nhập trạng thái thành công ${ids.length} sản phẩm!`);
            break;

        case "delete-all":
            await Account.updateMany({
                _id: {
                    $in: ids
                }
            }, {
                deleted: true,
                deletedAt: new Date()
            });
            req.flash("success", `đã xóa thành công ${ids.length} sản phẩm!`);
            break;

        default:
            break;
    }

    res.redirect("back");
}

//[Get] /admin/accounts/detail
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;

        const find = {
            deleted: false,
            _id: id
        }

        const data = await Account.findOne(find).select("-password -token");

        const role = await Role.findOne({
            _id: data.role_id,
            deleted: false,
        });

        data.roleTitle = role.title;

        res.render("admin/pages/accounts/detail", {
            pageTitle: data.fullName,
            data: data,
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }
}

//[Get] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;

        const find = {
            deleted: false,
            _id: id
        }

        const data = await Account.findOne(find);

        const roles = await Role.find({
            deleted: false,
        });

        if (data) {
            res.render("admin/pages/accounts/edit", {
                pageTitle: "Chỉnh sửa tài khoản",
                data: data,
                roles: roles,
            });
        } else {
            res.redirect(`${systemConfig.prefixAdmin}/accounts`);
        }
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }
}

// [PATCH] /admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
    try {
        const id = req.params.id;

        const emailExist = await Account.findOne({
            _id: {
                $ne: id
            },
            email: req.body.email,
            deleted: false,
        });

        if (emailExist) {
            req.flash("error", `Email ${req.body.email} đã tồn tại`);
        } else {
            if (req.body.password) {
                req.body.password = md5(req.body.password);
            } else {
                delete req.body.password;
            }

            await Account.updateOne({
                _id: id,
                deleted: false,
            }, req.body);

            req.flash("success", "Cập nhật tài khoản thành công!");
        }
    } catch (error) {
        req.flash("error", "không hợp lệ!");
    }

    res.redirect("back");
};