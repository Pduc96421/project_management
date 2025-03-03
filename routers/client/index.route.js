const productRouter = require("./product.route");
const homeRouter = require("./home.route");

const categoryMiddlerware = require("../../middlewares/client/category.middlerware");

module.exports = (app) => {
    app.use(categoryMiddlerware.category);

    app.use("/", homeRouter);

    app.use("/products", productRouter);
}