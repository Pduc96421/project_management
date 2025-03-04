const User = require("../../models/user.model");
const md5 = require("md5");

//[Get] /user/register
module.exports.register = async (req, res) => {
    res.render("client/pages/user/register", {
        pageTitle: "Đăng ký tài khoản",
    });
}

//[Post] /user/register
module.exports.registerPost = async (req, res) => {
    console.log(req.body);

    const exitsEmail = await User.findOne({
        email: req.body.email,
        deleted: false,
    });

    if(exitsEmail){
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