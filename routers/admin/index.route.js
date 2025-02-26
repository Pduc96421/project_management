const dasboardRoutes = require("./dasboard.route");

const systemConfig = require("../../config/system"); // luu tru cac dinh nghia(Path_ADMIN)

const productRoutes = require("./product.route");
const productCategoryRoutes = require("./products-category.route");
const roleRoutes = require("./role.route");

module.exports = (app) => {
    const Path_ADMIN = systemConfig.prefixAdmin;

    app.use(Path_ADMIN + "/dasboard", dasboardRoutes);

    app.use(Path_ADMIN + "/products", productRoutes);

    app.use(Path_ADMIN + "/products-category", productCategoryRoutes);

    app.use(Path_ADMIN + "/roles", roleRoutes);

}