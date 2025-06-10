const Roles = require("../../models/role.model");
const Accounts = require("../../models/account.model");
const systemConfig = require("../../config/system");


// [GET] /admin/roles
module.exports.index = async (req, res) => {
    const find = {
        deleted: false
    };

    const roles = await Roles.find(find);

    for (const role of roles) {
        const userCreate = await Accounts.findOne({
            _id: role.createdBy.account_id
        });
        if (userCreate) {
            role.account_Fullname = userCreate.fullName
        }

        const updatedBy = role.updatedBy.slice(-1)[0];
        if (updatedBy) {
            const userUpdate = await Accounts.findOne({
                _id: updatedBy.account_id
            });
            updatedBy.account_Fullname = userUpdate.fullName
        }
    }

    res.render("admin/pages/roles/index", {
        pageTitle: "Nhóm quyền",
        roles: roles
    });
}

// [GET] /admin/roles/create
module.exports.create = async (req, res) => {

    res.render("admin/pages/roles/create", {
        pageTitle: "Tạo nhóm quyền",
    });
}

// [POST] /admin/roles/create
module.exports.createPost = async (req, res) => {
    const permissions = res.locals.role.permissions;
    if (permissions.includes("roles_create")) {
        req.body.createdBy = {
            account_id: res.locals.user.id
        };
        const roles = new Roles(req.body);
        await roles.save();
        res.redirect(`${systemConfig.prefixAdmin}/roles`)
    }
    else {
        return;
    }
}

// [GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        }
        const role = await Roles.findOne(find);
        console.log(role);
        res.render("admin/pages/roles/edit", {
            pageTitle: "Sửa nhóm quyền",
            role: role
        });
    } catch (error) {
        req.flash("error", "Nhóm quyền không tồn tại!!!");
        res.redirect(`${systemConfig.prefixAdmin}/roles`)
    }
}

// [PATCH] /admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {

    try {
        const id = req.params.id
        const updatedBy = {
            account_id: res.locals.user.id,
            updatedAt: new Date()
        }
        await Roles.updateOne({ _id: id }, {
            ...req.body,
            $push: { updatedBy: updatedBy }
        });
        req.flash("success", "Cập nhật thành công");

    } catch (error) {
        req.flash("error", "Cập nhật thất bại!!");

    }
    res.redirect("back")
}

// [GET] /admin/roles/permissions
module.exports.permissions = async (req, res) => {
    const find = {
        deleted: false
    };

    const roles = await Roles.find(find);

    res.render("admin/pages/roles/permissions", {
        pageTitle: "Phân quyền",
        roles: roles
    });
}

// [PATCH] /admin/roles/permissions
module.exports.permissionsPatch = async (req, res) => {
    try {
        const permissions = JSON.parse(req.body.permissions);
        for (const item of permissions) {
            await Roles.updateOne({ _id: item.id }, { permissions: item.permissions });
        }
        req.flash("success", "Phân quyền thành công");
    } catch (error) {
        req.flash("error", "Phân quyền thất bại!!!");
    }
    res.redirect("back");


}

// [GET] /admin/roles/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };

        const role = await Roles.findOne(find);

        res.render("admin/pages/roles/detail", {
            pageTitle: role.title,
            role: role
        });
    } catch (error) {
        req.flash("success", "Phân quyền ko tôn tại!!");
        ré.redirect("back");
    }
}

// [DELETE] /admin/roles/delete/:id
module.exports.delete = async (req, res) => {
    try {
        const id = req.params.id;

        await Roles.updateOne({ _id: id }, {
            deleted: true,
            deletedBy: {
                account_id: res.locals.user.id,
                deletedAt: new Date()
            }
        });

        req.flash("success", "Xóa nhóm quyền thành công")
    } catch (error) {
        req.flash("error", "Xóa nhóm quyền thất bại!!!");
    }
    res.redirect("back");
}
