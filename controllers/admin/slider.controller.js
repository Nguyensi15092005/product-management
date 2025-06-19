const Slider = require("../../models/sliders.model");
const systemConfig = require("../../config/system");
const Accounts = require("../../models/account.model");

module.exports.index = async (req, res) => {
    try {
        const sliders = await Slider.find({
            deleted: false
        });
        console.log(sliders)
        for (const slider of sliders) {
            // lấy ra người tạo 
            const user = await Accounts.findOne({
                _id: slider.createdBy.account_id
            });
            if (user) {
                slider.account_Fullname = user.fullName
            }
        }
        res.render("admin/pages/sliders/index", {
            pageTitle: "sliders",
            sliders: sliders
        })
    } catch (error) {

    }
}

module.exports.create = (req, res) => {
    res.render("admin/pages/sliders/create", {
        pageTitle: "Thêm mới sliders"
    })
}

module.exports.createPost = async (req, res) => {
    try {
        req.body.createdBy = {
            account_id: res.locals.user.id
        }
        const dataSlider = new Slider(req.body);
        await dataSlider.save();
        req.flash("success", "Thêm mới sliders thành công!!!");
        res.redirect(`${systemConfig.prefixAdmin}/sliders`);
    } catch (error) {

    }

}

module.exports.ChangeStatus = async (req, res) => {
    try {
        const status = req.params.status;
        const id = req.params.id;

        await Slider.updateOne({ _id: id }, { status: status });
        req.flash("success", "Thay đổi trạng thái thành công");
        res.redirect("back");
    } catch (error) {

    }
}

module.exports.edit = async (req, res) => {
    try {
        const slider = await Slider.findOne({
            _id: req.params.id
        });
        res.render("admin/pages/sliders/edit", {
            pageTitle: "Chỉnh sửa sliders",
            slider: slider
        })
    } catch (error) {

    }
}

module.exports.editPatch = async (req, res) => {
    try {
        const id = req.params.id;
        await Slider.updateOne({_id:id}, {$set:{...req.body}});
        req.flash("success", "Bạn đã cập nhật slider thành công");
    } catch (error) {
        req.flash("error", "Bạn cập nhật slider thất bại");
    }
    res.redirect('back')
}

module.exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        await Slider.deleteOne({_id: id});
        req.flash("success", "Bạn đã xóa slider thành công");
    } catch (error) {
        req.flash("error", "Bạn cập nhật slider thất bại");
    }
    res.redirect('back')
}
