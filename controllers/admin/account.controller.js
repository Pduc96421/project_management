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

    for (const record of records){
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
        email: req.boday.email,
        deleted: false,
    });

    if (emailExist) {
        req.flash("error", "Email đã tồn tại");
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

        const data = await Account.findOne(find);

        // console.log(product);

        res.render("admin/pages/accounts/detail", {
            pageTitle: data.title,
            data: data,
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }
}