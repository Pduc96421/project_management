const dasboardRoutes = require("./dasboard.route");

const authMiddleware = require("../../middlewares/admin/auth.middleware");

const systemConfig = require("../../config/system");

const productRoutes = require("./product.route");
const productCategoryRoutes = require("./products-category.route");
const roleRoutes = require("./role.route");
const accountRoutes = require("./accounts.route");
const authRoutes = require("./auth.route");

module.exports = (app) => {
    const Path_ADMIN = systemConfig.prefixAdmin;
    app.use(
        Path_ADMIN + "/dasboard",
        authMiddleware.requireAuth,
        dasboardRoutes
    );
    app.use(
        Path_ADMIN + "/products", 
        authMiddleware.requireAuth,
        productRoutes
    );
    app.use(
        Path_ADMIN + "/products-category", 
        authMiddleware.requireAuth,
        productCategoryRoutes
    );
    app.use(
        Path_ADMIN + "/roles", 
        authMiddleware.requireAuth, 
        roleRoutes
    );
    app.use(Path_ADMIN + "/accounts", 
        authMiddleware.requireAuth, 
        accountRoutes
    );
    app.use(
        Path_ADMIN + "/auth", 
        authRoutes
    );
}