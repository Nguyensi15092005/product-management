const SettingGeneral = require("../../models/settings-general.model");

module.exports.general = async (req, res) => {
    const permissions = res.locals.role.permissions;
    if (permissions.includes("setting-general_view")) {
        const settingGeneral = await SettingGeneral.findOne({});
        res.render("admin/pages/settings/general", {
            pageTitle: "Cài đặt chung",
            settingGeneral: settingGeneral
        })
    }
    else{
        req.flash("error", "Bạn không có quyền xem")
        res.redirect("back");
    }
}

module.exports.generalPatch = async (req, res) => {
    const permissions = res.locals.role.permissions;
    if (permissions.includes("setting-general_edit")) {
        const settingGeneral = await SettingGeneral.findOne({});
        let logo = "";
        let image_slider_right_top = "";
        let image_slider_right_bottom = "";

        if (req.body.logo) {
            logo = req.body.logo[0]
        }
        if (req.body.image_slider_right_top) {
            image_slider_right_top = req.body.image_slider_right_top[0]
        }
        if (req.body.image_slider_right_bottom) {
            image_slider_right_bottom = req.body.image_slider_right_bottom[0]
        }
        const data = {
            websiteName: req.body.websiteName,
            logo: logo,
            phone: req.body.phone,
            email: req.body.email,
            addressText: req.body.addressText,
            facebook: req.body.facebook,
            zalo: req.body.zalo,
            tiktok: req.body.tiktok,
            copyright: req.body.copyright,
            image_slider_right_top: image_slider_right_top,
            image_slider_right_bottom: image_slider_right_bottom
        }
        if (settingGeneral) {
            await SettingGeneral.updateOne({ _id: settingGeneral.id }, data);
        }
        else {
            const record = new SettingGeneral(data);
            await record.save();
            res.redirect('back');
        }
    }
    else{
        req.flash("error", "Bạn không có quyền chỉnh sửa")
        res.redirect("back");
    }

}

