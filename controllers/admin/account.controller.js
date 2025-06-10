const md5 = require('md5');

const Accounts = require("../../models/account.model");
const Roles = require("../../models/role.model")
const systemConfig = require("../../config/system");


// [GET] /admin/accounts
module.exports.index = async (req, res) => {
    const find = {
        deleted: false
    };

    const accounts = await Accounts.find(find).select("-password -token");
    //select dùng để trả về những cái nào (-pass) là sẻ loại từ nó

    for (const account of accounts) {
        const role = await Roles.findOne({
            deleted: false,
            _id: account.role_id,
        });
        account.role = role;

        // lấy ra người tạo 
        const userCreate = await Accounts.findOne({
            _id: account.createdBy.account_id
        })
        if (userCreate) {
            account.account_Fullname = userCreate.fullName
        }

        // lấy ra người chỉnh sửa
        const updatedBy = account.updatedBy.slice(-1)[0];
        if (updatedBy) {
            const userUpdate = await Accounts.findOne({
                _id: updatedBy.account_id
            });
            updatedBy.account_Fullname = userUpdate.fullName
        }

    };



    res.render("admin/pages/accounts/index", {
        pageTitle: "Danh sách tài khoản",
        accounts: accounts
    });
}

// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {
    const find = {
        deleted: false
    };
    const role = await Roles.find(find);
    res.render("admin/pages/accounts/create", {
        pageTitle: "Thêm mới tài khoản",
        roles: role
    });
}

// [POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
    const permissions = res.locals.role.permissions;
    if (permissions.includes("accounts_create")) {
        const emailExit = await Accounts.findOne({
            email: req.body.email,
            deleted: false
        });

        const phoneExit = await Accounts.findOne({
            phone: req.body.phone,
            deleted: false
        });

        if (emailExit) {
            req.flash("error", `Email ${req.body.email} đã tồn tại`);
            res.redirect("back");
        }
        else if (phoneExit) {
            req.flash("error", `Số điện thoại ${req.body.phone} đã tồn tại`);
            res.redirect("back");
        }
        else {
            req.body.createdBy = {
                account_id: res.locals.user.id,
                createdAt: new Date()
            };
            req.body.password = md5(req.body.password);
            const account = new Accounts(req.body);
            await account.save();
            res.redirect(`${systemConfig.prefixAdmin}/accounts`);
        }

    }
    else {
        return;
    }

}

// [GET] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
    const find = {
        deleted: false,
        _id: req.params.id
    };

    try {
        const accounts = await Accounts.findOne(find).select("-token");

        const role = await Roles.find({
            deleted: false
        });

        res.render("admin/pages/accounts/edit", {
            pageTitle: "Chỉnh sửa tài khoản",
            accounts: accounts,
            roles: role
        });

    } catch (error) {
        req.redirect(`${systemConfig.prefixAdmin}/accounts`)
    }

}

// [PATCH] /admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;

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
            const updatedBy = {
                account_id: res.locals.user.id,
                updatedAt: new Date()
            }

            await Accounts.updateOne({ _id: id }, {
                ...req.body,
                $push: { updatedBy: updatedBy }
            });
            req.flash("success", "Cập nhật tài khoản thành công");

        }
    } catch (error) {
        req.flash("error", "Cập nhật thất bại!!!");
    }
    res.redirect("back");

}

// [PATCH] /admin/accounts/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const id = req.params.id;
    const status = req.params.status;

    await Accounts.updateOne({ _id: id }, { status: status });

    res.redirect("back");

}

// [GET] /admin/accounts/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        }

        const account = await Accounts.findOne(find).select("-password");

        const role = await Roles.find({
            deleted: false
        });

        res.render("admin/pages/accounts/detail", {
            pageTitle: "Tài khoản",
            account: account,
            roles: role
        });
    } catch (error) {
        req.flash("error", "Tài khoản không tồn tại");
        res.redirect(`${systemConfig.prefixAdmin}/accounts`)
    }
}

// [PATCH] /admin/accounts/delete/:id
module.exports.delete = async (req, res) => {
    try {
        const id = req.params.id;

        await Accounts.updateOne({ _id: id }, {
            deleted: true,
            deletedBy: {
                account_id: res.locals.user.id,
                deletedAt: new Date()
            }
        });

        req.flash("success", "Xóa tài khoản thành công");

    } catch (error) {
        req.flash("error", "Tài khoản không tồn tại");
    }
    res.redirect("back");

}