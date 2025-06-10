const User = require("../../models/users.model");
const Account = require("../../models/account.model");

// [GET] admin/user
module.exports.user = async (req, res) => {
    const permissions = res.locals.role.permissions;
    if (permissions.includes("user_manage_view")) {
        const users = await User.find({
            deleted: false
        });
        // lấy ra người chỉnh sửa
        for (const user of users) {
            const updatedBy = user.updatedBy.slice(-1)[0];
            console.log(updatedBy);
            if (updatedBy) {
                const userUpdatedBy = await Account.findOne({
                    _id: updatedBy.account_id
                })
                console.log(userUpdatedBy);
                updatedBy.account_Fullname = userUpdatedBy.fullName
            }
        }
        res.render("admin/pages/user/index", {
            pageTitle: "Quản lý user",
            user: users,
        })
    }
    else{
        return;
    }
}

// [PATCH] admi/user/change-status/:status/id
module.exports.changeStatus = async (req, res) => {
    const permissions = res.locals.role.permissions;
    if (permissions.includes("user_manage_edit")) {
        try {
            const status = req.params.status;
            const id = req.params.id;
            const updatedBy = {
                account_id: res.locals.user.id,
                updatedteAt: new Date()
            };

            await User.updateOne({ _id: id }, {
                status: status,
                $push: { updatedBy: updatedBy }
            });

            req.flash("success", "Thay đổi trạng thái User thành công");
        } catch (error) {
            req.flash("error", "thất bại");
        }
        res.redirect("back");
    }
    else{
        return;
    }
}

// [DELETE] admin/user/delete/:id
module.exports.delete = async (req, res) => {
    const permissions = res.locals.role.permissions;
    if (permissions.includes("user_manage_delete")) {
        try {
            const id = req.params.id;
            const deletedBy = {
                account_id: res.locals.user.id,
                deletedAt: new Date()
            }
            await User.updateOne({ _id: id }, {
                deleted: true,
                deletedBy: deletedBy
            });

            req.flash("success", "Xóa User thành công");
        } catch (error) {

        }
        res.redirect("back");
    }
    else{
        return;
    }
}