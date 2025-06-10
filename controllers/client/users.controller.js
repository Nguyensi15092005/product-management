const User = require("../../models/users.model");
const Cart = require("../../models/carts.model");
const md5 = require("md5");
const generateHelper = require("../../helper/generate");
const ForgetPassword = require("../../models/forgot-password.model");
const sendMailHelper = require("../../helper/sendMail");
// [GET] user/register
module.exports.register = async (req, res) => {
    res.render("client/pages/user/register", {
        pageTitle: "Đăng ký"
    })

}

// [POST] user/register
module.exports.registerPost = async (req, res) => {
    const emailExit = await User.findOne({
        email: req.body.email
    })

    if (emailExit) {
        req.flash("error", `Email: ${req.body.email} đã tồn tại vui lòng dùng email khác!!!`);
        res.redirect("back");
        return;
    }
    req.body.password = md5(req.body.password);
    const user = new User(req.body);
    await user.save();

    res.cookie("tokenUser", user.tokenUser);

    req.flash("success", "Đăng ký tài khoản thành công");

    res.redirect("/");


}

// [GET] user/login
module.exports.login = async (req, res) => {
    res.render("client/pages/user/login", {
        pageTitle: "Đăng nhập"
    })

}

// [POST] user/login
module.exports.loginPost = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({
        email: email,
        deleted: false
    });

    if (!user) {
        req.flash("error", `Email: ${email} này chưa đăng ký tài khoản`);
        res.redirect("back");
        return;
    }

    if (md5(password) !== user.password) {
        req.flash("error", "Mật khẩu không đúng!!!");
        res.redirect("back");
        return;
    }

    if (user.status === "inactive") {
        req.flash("error", "Tài khoản của bạn đang bị khóa");
        res.redirect("back");
        return;
    }

    const cart = await Cart.findOne({
        user_id: user.id
    });
    if (cart) {
        res.cookie("cartID", cart.id);
    }
    else {
        await Cart.updateOne({
            _id: req.cookies.cartID
        }, {
            user_id: user.id
        })
    }

    res.cookie("tokenUser", user.tokenUser);

    await User.updateOne({
        tokenUser: user.tokenUser
    }, {
        statusOnline: "online"
    })
    // socketIO
    _io.once('connection', (socket) => {
        socket.broadcast.emit("SERVER_RETURN_USER_STATUS_ONLINE", user.id);
    });

    req.flash("success", "Đăng nhập thành công");

    res.redirect("/");




}

// [GET] user/logout
module.exports.logout = async (req, res) => {
    await User.updateOne({
        tokenUser: req.cookies.tokenUser
    }, {
        statusOnline: "offline"
    });
    const user = await User.findOne({
        tokenUser: req.cookies.tokenUser
    });

    // socketIO
    _io.once('connection', (socket) => {
        socket.broadcast.emit("SERVER_RETURN_USER_STATUS_OFFLINE", user.id);
    });

    res.clearCookie("cartID");
    res.clearCookie("tokenUser");
    req.flash("success", "Đăng xuất thành công");
    res.redirect("/");
}

// [GET] user/password/forgot
module.exports.forgotPassword = async (req, res) => {
    res.render("client/pages/user/forgotPassword", {
        pageTitle: "Quên mật khẩu"
    })
}

// [POST] user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
    const email = req.body.email;

    const user = await User.findOne({
        email: email,
        deleted: false
    });

    if (!user) {
        req.flash("error", "Email này ko tồn tại");
        res.redirect('back');
        return;
    }

    // lưu thồn tin vào DB

    const otp = generateHelper.generateRandomNumber(6);
    const objectForgotPassword = {
        email: email,
        otp: otp,
        expireAt: Date.now()
    }

    const forgotPassword = new ForgetPassword(objectForgotPassword);
    await forgotPassword.save();

    // Gửi mã OTP qua email 
    const subject = "Mã OTP xác minh để lấy lại mật khẩu"
    const html = `Mã OTP xác minh là <b>${otp}</b> thời hạn là 3 phút.`
    sendMailHelper.sendMail(email, subject, html);

    res.redirect(`/user/password/otp?email=${email}`)
}

// [GET] user/password/otp
module.exports.otpPassword = async (req, res) => {
    const email = req.query.email;
    console.log(email);
    res.render("client/pages/user/otp-password", {
        pageTitle: "Xác thực mã OTP",
        email: email
    })
}

// [POST] user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;
    console.log(email, otp)

    const forgot = await ForgetPassword.findOne({
        email: email,
        otp: otp
    });
    console.log(forgot)
    if (!forgot) {
        req.flash("error", "Mã OTP bị sai");
        res.redirect("back");
        return;
    }

    const user = await User.findOne({
        email: email
    });


    res.cookie("tokenUser", user.tokenUser);

    res.redirect("/user/password/reset");
}

// [GET] user/password/otp
module.exports.resetPassword = async (req, res) => {
    res.render("client/pages/user/reset-password", {
        pageTitle: "Đặt lại mật khẩu",
    })
}

// [POST] user/password/otp
module.exports.resetPasswordPost = async (req, res) => {
    const password = req.body.password;
    const tokenUser = req.cookies.tokenUser;

    await User.updateOne({
        tokenUser: tokenUser
    }, {
        password: md5(password)
    })

    req.flash("success", "Chúc mừng bạn đã đổi mật khẩu mới thành công");

    res.redirect("/");
}

// [GET] user/infor
module.exports.infor = async (req, res) => {

    res.render("client/pages/user/infor", {
        pageTitle: "Thông tin tài khoản",
    })
}