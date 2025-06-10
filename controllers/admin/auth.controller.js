const md5 = require('md5');

const Accounts = require("../../models/account.model");
const Roles = require("../../models/role.model");
const systemConfig = require("../../config/system");

// [GET] /auth/login
module.exports.login = async (req, res) => {
    const user = await Accounts.findOne({
        token: req.cookies.token
    });
    if (req.cookies.token && user) {
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    }
    else{
        res.render("admin/pages/auth/login",{
            pageTitle: "Đăng nhập"
        });
    }
}

// [POST] /auth/login
module.exports.loginPost =async (req, res) => {
    
    const user = await Accounts.findOne({
        email: req.body.email,
        deleted: false
    });

    if(!user){
        req.flash("error", "Email không tồn tại!!!");
        res.redirect('back');
        return;
    }

    if(md5(req.body.password) != user.password){
        req.flash("error", "Sai mật khẩu!!!");
        res.redirect('back');
        return;
    }

    if(user.status == "inactive"){
        req.flash("error", "Tài khoản đã bị khóa!!!");
        res.redirect('back');
        return;
    }

    // Thêm token vào trong cookie
    res.cookie("token", user.token);
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`);

}

// [GET] /auth/logout
module.exports.logout = (req, res) => {
    // xóa token trong cookie
    res.clearCookie("token");
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
}