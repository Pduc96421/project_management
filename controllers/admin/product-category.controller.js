const ProductCategory = require("../../models/product-category.model");

const systemConfig = require("../../config/system");
const searchHelper = require("../../helpers/search");
const createTreeHelper = require("../../helpers/create-tree");
const filterStatusHelper = require("../../helpers/filterStatus");

// [GET] /admin/product-category
module.exports.index = async (req, res) => {
    // Bộ lọclọc
    const filterStatus = filterStatusHelper(req.query);
    // end bộ lọc 

    if (req.query.status) {
        find.status = req.query.status;
    }

    // find form-word
    const objectSearch = searchHelper(req.query);

    if (objectSearch.regex) {
        find.title = objectSearch.regex;
    }
    // end find form-word

    // Sort
    let sort = {};

    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    } else {
        sort.position = "desc";
    }
    // end Sort

    const records = await ProductCategory.find({
            deleted: false
        })
        .sort(sort)

    const newRecords = createTreeHelper.tree(records);

    res.render("admin/pages/products-category/index", {
        pageTitle: "Danh mục sản phẩm",
        records: newRecords,
        keyword: objectSearch.keyword,
        filterStatus: filterStatus,
    });
}

// [GET] /admin/product-category/create
module.exports.create = async (req, res) => {
    let find = {
        deleted: false,
    }

    const records = await ProductCategory.find(find);

    const newRecords = createTreeHelper.tree(records);

    res.render("admin/pages/products-category/create", {
        pageTitle: "Tạo danh mục sản phẩm",
        records: newRecords,
    });
}

// [POST] /admin/products-category/create
module.exports.createPost = async (req, res) => {
    if (req.body.position == "") {
        const count = await ProductCategory.countDocuments();
        req.body.position = count + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }

    const record = new ProductCategory(req.body);
    await record.save();

    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
};

// [PATCH] /adim/products-category/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    // console.log(req.params);// in ra status vs id (trong route cua url)
    const status = req.params.status;
    const id = req.params.id;

    await ProductCategory.updateOne({
        _id: id
    }, {
        status: status
    });

    req.flash("success", "cập nhật trạng thái thành công!");

    res.redirect("back");
};

//[DELETE] /adim/products-category/delete/:id 
module.exports.deleteItem = async (req, res) => {
    // console.log(req.params);// in ra status vs id (trong route cua url)
    const id = req.params.id;

    await ProductCategory.deleteOne({
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

//[PATCH] /adim/products-category/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type; // lấy ở trong pug (name)
    const ids = req.body.ids.split(", ");

    switch (type) {
        case "active":
            await ProductCategory.updateMany({
                _id: {
                    $in: ids
                }
            }, {
                status: "active"
            });
            req.flash("success", `cập nhập trạng thái thành công ${ids.length} sản phẩm!`);
            break;
        case "inactive":
            await ProductCategory.updateMany({
                _id: {
                    $in: ids
                }
            }, {
                status: "inactive"
            });
            req.flash("success", `cập nhập trạng thái thành công ${ids.length} sản phẩm!`);
            break;

        case "delete-all":
            await ProductCategory.updateMany({
                _id: {
                    $in: ids
                }
            }, {
                deleted: true,
                deletedAt: new Date()
            });
            req.flash("success", `đã xóa thành công ${ids.length} sản phẩm!`);
            break;

        case "change-position":
            for (const item of ids) {
                let [id, position] = item.split("-");
                position = parseInt(position);
                await ProductCategory.updateOne({
                    _id: id
                }, {
                    position: position
                });
            };
            req.flash("success", `đã đổi thành công ${ids.length} sản phẩm!`);
            break;

        default:
            break;
    }

    res.redirect("back");
};

// [GET] /admin/product-category/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;

        const find = {
            deleted: false,
            _id: id
        }

        const data = await ProductCategory.findOne(find);

        const records = await ProductCategory.find({
            deleted: false,
        });

        const newRecords = createTreeHelper.tree(records);

        res.render("admin/pages/products-category/edit", {
            pageTitle: "chỉnh sửa danh mục sản phẩm",
            data: data,
            records: newRecords,
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    }
}

// [PATCH] /admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {
    try {
        const id = req.params.id;

        req.body.price = parseInt(req.body.price);
        req.body.discountPercentage = parseInt(req.body.discountPercentage);
        req.body.stock = parseInt(req.body.stock);
        if (req.body.position) {
            req.body.position = parseInt(req.body.position);
        } else {
            const countProducts = await Product.countDocuments({});
            req.body.position = countProducts + 1;
        }

        await ProductCategory.updateOne({
            _id: id,
            deleted: false
        }, req.body);

        req.flash("success", "Cập nhật sản phẩm thành công!");
    } catch (error) {
        req.flash("error", "Id sản phẩm không hợp lệ!");
    }

    res.redirect("back");
}