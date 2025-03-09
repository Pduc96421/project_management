const productRouter = require("./product.route");
const homeRouter = require("./home.route");
const searchRouter = require("./search.route");
const cartRouter = require("./cart.route");
const checkoutRouter = require("./checkout.route");
const userRouter = require("./user.route");
const chatRouter = require("./chat.route");

const categoryMiddlerware = require("../../middlewares/client/category.middlerware");
const cartMiddlerware = require("../../middlewares/client/cart.middlerware");
const userMiddlerware = require("../../middlewares/client/user.middlerware");
const settingMiddlerware = require("../../middlewares/client/setting.middlerware");
const authMiddlerware = require("../../middlewares/client/auth.middlerware");

module.exports = (app) => {
    app.use(categoryMiddlerware.category);
    app.use(cartMiddlerware.cartId);
    app.use(userMiddlerware.infoUser);
    app.use(settingMiddlerware.settingGeneral);

    app.use("/", homeRouter);

    app.use("/products", productRouter);

    app.use("/search", searchRouter);

    app.use("/cart", cartRouter);

    app.use("/checkout", checkoutRouter);
    
    app.use("/user", userRouter);    
    
    app.use("/chat", authMiddlerware.requireAuth, chatRouter);    

}