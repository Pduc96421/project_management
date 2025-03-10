module.exports.registerPost = (req, res, next) => {
    if(!req.body.fullName){
        req.flash("error", 'Vui lòng nhập họ tên');
        res.redirect("back");
        return;
    }

    if(!req.body.email){
        req.flash("error", 'Vui lòng nhập email');
        res.redirect("back");
        return;
    }

    if(!req.body.password){
        req.flash("error", 'Vui lòng nhập mật khẩu');
        res.redirect("back");
        return;
    }

    next(); // sang buoc ke tiep
}

module.exports.loginPost = (req, res, next) => {

    if(!req.body.email){
        req.flash("error", 'Vui lòng nhập email');
        res.redirect("back");
        return;
    }

    if(!req.body.password){
        req.flash("error", 'Vui lòng nhập mật khẩu');
        res.redirect("back");
        return;
    }

    next(); // sang buoc ke tiep
}

module.exports.forgotPasswordPost = (req, res, next) => {

    if(!req.body.email){
        req.flash("error", 'Vui lòng nhập email');
        res.redirect("back");
        return;
    }

    next(); // sang buoc ke tiep
}

module.exports.resetPasswordPost = (req, res, next) => {

    if(!req.body.password){
        req.flash("error", 'Vui lòng nhập mật khẩu');
        res.redirect("back");
        return;
    }

    if(!req.body.confirmPassword){
        req.flash("error", 'Vui lòng xác nhận lại mật khẩu');
        res.redirect("back");
        return;
    }

    if(req.body.confirmPassword != req.body.password){
        req.flash("error", 'xác nhận mật khẩu không trùng khớp');
        res.redirect("back");
        return;
    }

    next(); // sang buoc ke tiep
}