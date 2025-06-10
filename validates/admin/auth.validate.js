module.exports.authLogin = (req, res, next) => {
    if (!req.body.email) {
        req.flash("error", "vui lòng nhập email!!!")
        res.redirect("back")
        return;
    }

    if (!req.body.password) {
        req.flash("error", "vui lòng nhập Mật khẩu!!!")
        res.redirect("back")
        return;
    }


    next();//hàm nexext để nó đi tiếp

}