const Product = require("../../models/product.model");
const productHelper = require("../../helpers/product");

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
            slug: req.params.slug
        }
        
        const product = await Product.findOne(find);

        console.log(product);

        res.render("client/pages/products/detail", {
            pageTitle: product.title,
            product: product,
        });
    } catch (error) {
        res.redirect(`/products`);
    }
}