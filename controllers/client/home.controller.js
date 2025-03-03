const Product = require("../../models/product.model");
const productHelper = require("../../helpers/product");

//[Get] /
module.exports.index = async (req, res) => {
    // lấy ra sản phẩm nổi bật
    const productsFeatured = await Product.find({
        featured: "1",
        deleted: false,
        status: "active",
    })
    
    const newProductsFeatured = productHelper.priceNewProducts(productsFeatured);
    //  end lấy ra sản phẩm nổi bật

    // lấy ra sản phẩm mới nhất
    const productNew = await Product.find({
        deleted: false,
        status: "active",
    }).sort({ position: "desc" }).limit(6); 

    const newProductNew = productHelper.priceNewProducts(productNew);
    // end lấy ra sản phẩm mới nhất
    
    res.render("client/pages/home/index", {
        pageTitle: "Trang chu",
        productsFeatured: newProductsFeatured,
        productNew: newProductNew,
    });
}