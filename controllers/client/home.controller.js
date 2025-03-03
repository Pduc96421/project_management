const Product = require("../../models/product.model");
const productHelper = require("../../helpers/product");

//[Get] /
module.exports.index = async (req, res) => {
    const productsFeatured = await Product.find({
        featured: "1",
        deleted: false,
        status: "active",
    })

    const newProductsFeatured = productHelper.priceNewProducts(productsFeatured);

    res.render("client/pages/home/index", {
        pageTitle: "Trang chu",
        productsFeatured: newProductsFeatured,
    });
}