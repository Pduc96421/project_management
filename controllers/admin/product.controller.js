const Product = require("../../models/product.model");

const systemConfig = require("../../config/system");

const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");

//[Get] /admin/products
module.exports.index = async (req, res) => {
    // Bộ lọclọc
    const filterStatus = filterStatusHelper(req.query);
    // end bộ lọc 

    let find = {
        deleted: false
    };

    if (req.query.status) {
        find.status = req.query.status;
    }

    // find form-word
    const objectSearch = searchHelper(req.query);

    if (objectSearch.regex) {
        find.title = objectSearch.regex;
    }
    // end find form-word

    // pagination (phân trang)
    const countProducts = await Product.countDocuments(find);

    let objectPageination = paginationHelper({
            currentPage: 1,
            limitItem: 4
        },
        req.query, // sau dau ? cua url
        countProducts
    );
    // end pagination

    const products = await Product.find(find)
        .sort({
            position: "desc"
        })
        .limit(objectPageination.limitItem)
        .skip(objectPageination.skip);

    res.render("admin/pages/products/index", {
        pageTitle: "Danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPageination
    });
}

//[PATCH] /adim/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    // console.log(req.params);// in ra status vs id (trong route cua url)
    const status = req.params.status;
    const id = req.params.id;

    await Product.updateOne({
        _id: id
    }, {
        status: status
    });

    req.flash("success", "cập nhật trạng thái thành công!");

    res.redirect("back");
};

//[PATCH] /adim/products/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");

    switch (type) {
        case "active":
            await Product.updateMany({
                _id: {
                    $in: ids
                }
            }, {
                status: "active"
            });
            req.flash("success", `cập nhập trạng thái thành công ${ids.length} sản phẩm!`);
            break;
        case "inactive":
            await Product.updateMany({
                _id: {
                    $in: ids
                }
            }, {
                status: "inactive"
            });
            req.flash("success", `cập nhập trạng thái thành công ${ids.length} sản phẩm!`);
            break;

        case "delete-all":
            await Product.updateMany({
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
                await Product.updateOne({
                    _id: id
                }, {
                    position: position
                });
            };
            req.flash("success", `đã đổiđổi thành công ${ids.length} sản phẩm!`);
            break;

        default:
            break;
    }

    res.redirect("back");
};

//[DELETE] /adim/products/delete/:id 
module.exports.deleteItem = async (req, res) => {
    // console.log(req.params);// in ra status vs id (trong route cua url)
    const id = req.params.id;

    // await Product.deleteOne({ _id: id }); // xoa cung
    await Product.updateOne({
        _id: id
    }, {
        deleted: true,
        deletedAt: new Date()
    }); // xoa mem

    res.redirect("back");
};

// [Get] /admin/products/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/products/create", {
        pageTitle: "Thêm mới sản phẩm"
    });
};

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);

    if (req.body.position == "") {
        const countProducts = await Product.countDocuments();
        req.body.position = countProducts + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }

    if (req.file) {
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }
    const product = new Product(req.body);
    await product.save();

    res.redirect(`${systemConfig.prefixAdmin}/products`);
};

// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;

        const find = {
            deleted: false,
            _id: id
        }

        const product = await Product.findOne(find);

        // console.log(product);

        res.render("admin/pages/products/edit", {
            pageTitle: "Chỉnh sửa sản phẩm",
            product: product,
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
};

// [PATCH] /admin/product/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;

    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);

    req.body.position = parseInt(req.body.position);

    if (req.file) {
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }
    try {
        await Product.updateOne({
            _id: id,
        }, req.body);
        req.flash("success", "Cập nhập thành công!");
    } catch (error) {
        req.flash("success", "Cập nhập thất bại!");
    }

    res.redirect("back");
};


// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;

        const find = {
            deleted: false,
            _id: id
        }
        
        const product = await Product.findOne(find);

        // console.log(product);

        res.render("admin/pages/products/detail", {
            pageTitle: product.title,
            product: product,
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
};
