const Accounts = require("../../models/account.model");
const md5 = require('md5');

module.exports.index = (req, res) => {
    res.render("admin/pages/my-account/index", {
        pageTitle: "Thông tin cá nhân"
    })
}

module.exports.edit = (req, res) => {
    res.render("admin/pages/my-account/edit", {
        pageTitle: "Chỉnh sửa thông tin cá nhân"
    })
}

module.exports.editPatch = async (req, res) => {
    console.log(req.body)
    const id = res.locals.user.id;

    const emailExit = await Accounts.findOne({
        _id: { $ne: id }, // nó sẻ tìm kiếm các phần tử loại từ phần tử có id này ra
        email: req.body.email,
        deleted: false
    });

    const phoneExit = await Accounts.findOne({
        _id: { $ne: id },
        phone: req.body.phone,
        deleted: false
    });

    try {
        if (emailExit) {
            req.flash("error", `Email ${req.body.email} đã tồn tại`);
        }
        else if (phoneExit) {
            req.flash("error", `Số điện thoại ${req.body.phone} đã tồn tại`);
        }
        else {
            if (req.body.password) {
                req.body.password = md5(req.body.password)
            }
            else {
                delete req.body.password
            }
            console.log(req.body)

            await Accounts.updateOne({ _id: id }, req.body);
            req.flash("success", "Cập nhật tài khoản thành công");

        }
    } catch (error) {
        req.flash("error", "Cập nhật thất bại!!!");
    }
    res.redirect("back");

}
