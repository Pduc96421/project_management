const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const productHelper = require("../../helpers/product");
const productsCategoryHelper = require("../../helpers/products-category");

//[Get] /products
module.exports.index = async (req, res) => {
    const products = await Product.find({
        status: "active",
        deleted: false
    }).sort({ position: "desc"});

    const newProducts = productHelper.priceNewProducts(products);
    // console.log(products);

    res.render("client/pages/products/index", {
        pageTitle: "Danh sach san pham",
        products: newProducts
    });
}

//[Get] /products/detail
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            status: "active",
            slug: req.params.slugProduct
        }

        const product = await Product.findOne(find);

        if(product.product_category_id){
            const category = await ProductCategory.findOne({
                _id: product.product_category_id,
                status: "active",
                deleted: false
            })

            product.category = category;
        }

        product.priceNew = productHelper.priceNewProduct(product);

        res.render("client/pages/products/detail", {
            pageTitle: product.title,
            product: product,
        });
    } catch (error) {
        res.redirect(`/products`);
    }
}

//[Get] /products/category/:slugCategory
module.exports.category = async (req, res) => {
    const category = await ProductCategory.findOne({
        slug: req.params.slugCategory,
        deleted: false,
    });

    const listSubCategory = await productsCategoryHelper.getSubCategory(category.id);

    const listSubCategoryId = listSubCategory.map(item => item.id);

    const products = await Product.find({
        product_category_id: {$in: [category.id, ...listSubCategoryId]},
        deleted: false,
        status: "active",
    }).sort({ position: "desc"});

    const newProducts = productHelper.priceNewProducts(products);

    res.render("client/pages/products/index", {
        pageTitle: category.title,
        products: newProducts
    });
}