const md5 = require("md5");

const User = require("../../models/user.model");
const ForgotPassword = require("../../models/forgot-password.model");
const Cart = require("../../models/cart.model");

const generateHelper = require("../../helpers/generate");
const sendMailHepler = require("../../helpers/sendMail");
const {
    MongoUnexpectedServerResponseError
} = require("mongodb");

//[Get] /user/register
module.exports.register = async (req, res) => {
    res.render("client/pages/user/register", {
        pageTitle: "Đăng ký tài khoản",
    });
}

//[Post] /user/register
module.exports.registerPost = async (req, res) => {
    const exitsEmail = await User.findOne({
        email: req.body.email,
        deleted: false,
    });

    if (exitsEmail) {
        req.flash("error", "Email đã tồn tại");
        res.redirect("back");
        return;
    }

    req.body.password = md5(req.body.password);

    const user = new User(req.body);
    await user.save();

    res.cookie("tokenUser", user.tokenUser);

    res.redirect("/");
}

//[Get] /user/login
module.exports.login = async (req, res) => {
    res.render("client/pages/user/login", {
        pageTitle: "Đăng nhập tài khoản",
    });
}

//[Post] /user/login
module.exports.loginPost = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({
        email: email,
        deleted: false,
    });

    if (!user) {
        req.flash("error", "Email không tồn tại");
        res.redirect("back");
        return;
    }

    if (md5(password) != user.password) {
        req.flash("error", "Sai mật khẩu");
        res.redirect("back");
        return;
    }

    if (user.status == "inactive") {
        req.flash("error", "Tài khoản đang bị khóa");
        res.redirect("back");
        return;
    }

    res.cookie("tokenUser", user.tokenUser);

    await User.updateOne({
        _id: user.id,
    }, {
        statusOnline: "online",
    });

    // server trả về thông tin user khi đăng nhập
    _io.once('connection', (socket) => {
        socket.broadcast.emit("SERVER_RETURN_USER_ONLINE", user.id);
    });

    // luu user_id vao collection
    const cartId = req.cookies.cartId;
    await Cart.updateOne({
        _id: cartId,
    }, {
        user_id: user.id,
    });

    res.redirect("/");
}

//[Get] /user/logout
module.exports.logout = async (req, res) => {
    
    await User.updateOne({
        _id: res.locals.user.id,
    }, {
        statusOnline: "offline",
    });

    // server trả về thông tin user khi đăng xuat
    _io.once('connection', (socket) => {
        socket.broadcast.emit("SERVER_RETURN_USER_OFFLINE", res.locals.user.id);
    });

    res.clearCookie("tokenUser");
    res.redirect("/");
}

//[Get] /user/password/fotgot
module.exports.forgotPassword = async (req, res) => {
    res.render("client/pages/user/forgot-password", {
        pageTitle: "Lấy lại mật khẩu",
    });
}

//[Post] /user/password/fotgot
module.exports.forgotPasswordPost = async (req, res) => {
    const email = req.body.email;

    const user = await User.findOne({
        email: email,
        deleted: false,
    });

    if (!user) {
        req.flash("error", "Email đã tồn tại");
        res.redirect("back");
        return;
    }

    // 1: tạo mã otp và lưu otp, emailemail yêu cầu vào collection
    const otp = generateHelper.generateRandomNumber(8)

    const objectForgotPassword = {
        email: email,
        otp: otp,
        expireAt: Date.now(),
    }

    const forgotPassword = new ForgotPassword(objectForgotPassword);
    await forgotPassword.save();
    // end tạo mã otp và lưu thông tin yêu cầu vào collection

    // 2:  gửi mã otp qua email của user
    const subject = "Mã OTP lấy lại mật khẩu.";
    const htmlSendMail = `Mã OTP xác thực của bạn là <b style="color: green;">${otp}</b>. Mã OTP có hiệu lực trong 3 phút. Vui lòng không cung cấp mã OTP cho người khác.`;
    sendMailHepler.sendEmail(email, subject, htmlSendMail);
    // end 2:  gửi mã otp qua email của user

    res.redirect(`/user/password/otp?email=${email}`);
}

//[Get] /user/password/otp
module.exports.otpPassword = async (req, res) => {
    const email = req.query.email;

    res.render("client/pages/user/otp-password", {
        pageTitle: "Nhập mã OTP",
        email: email,
    });
}

//[Post] /user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;

    const result = await ForgotPassword.findOne({
        email: email,
        otp: otp,
    });

    if (!result) {
        req.flash("error", "OTP không hợp lệ");
        res.redirect("back");
        return;
    }

    const user = await User.findOne({
        email: email,
        deleted: false,
    })

    res.cookie("tokenUser", user.tokenUser);

    res.redirect("/user/password/reset");
}

//[Get] /user/password/reset
module.exports.resetPassword = async (req, res) => {
    res.render("client/pages/user/reset-password", {
        pageTitle: "Đổi mật khẩu",
    });
}

//[Post] /user/password/otp
module.exports.resetPasswordPost = async (req, res) => {
    const password = req.body.password;
    const tokenUser = req.cookies.tokenUser;

    await User.updateOne({
        tokenUser: tokenUser,
    }, {
        password: md5(password),
    });

    req.flash("success", "đổi mật khẩu thành công");

    res.redirect("/");
}

//[Get] /user/info
module.exports.info = async (req, res) => {
    res.render("client/pages/user/info", {
        pageTitle: "Thông tin tài khoản",
    });
}