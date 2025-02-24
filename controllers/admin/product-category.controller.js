const ProductCategory = require("../../models/product-category.model");
const systemConfig = require("../../config/system");
const searchHelper = require("../../helpers/search");
const createTreeHelper = require("../../helpers/create-tree");
const filterStatusHelper = require("../../helpers/filterStatus");

// [GET] /admin/product-category
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    };

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

    const records = await ProductCategory.find(find)
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