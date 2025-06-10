const SettingGeneral = require("../../models/settings-general.model");

module.exports.general = async (req, res) => {
    if (role.permissions.includes("setting-general_view")) {
        const settingGeneral = await SettingGeneral.findOne({});
        res.render("admin/pages/settings/general", {
            pageTitle: "Cài đặt chung",
            settingGeneral: settingGeneral
        })
    }
}

module.exports.generalPatch = async (req, res) => {
    if (role.permissions.includes("setting-general_edit")) {
        const settingGeneral = await SettingGeneral.findOne({});
        if (settingGeneral) {
            await SettingGeneral.updateOne({ _id: settingGeneral.id }, req.body);
        }
        else {
            const record = new SettingGeneral(req.body);
            await record.save();
            res.redirect('back');
        }
    }
    else{
        req.flash("error", "Bạn không có quyền chỉnh sửa")
        res.redirect("back");
    }

}

