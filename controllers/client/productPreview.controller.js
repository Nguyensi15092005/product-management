const ProductPreview = require("../../models/productPreview.model");
const User = require("../../models/users.model");

module.exports.index = async (req, res) => {
    try {
        const productId = req.body.productId;
        const content = req.body.content;
        const token = req.cookies.tokenUser;
        const user = await User.findOne({
            tokenUser: token,
            deleted: false
        });
        const data = new ProductPreview({
            product_Id: productId,
            user_Id: user._id,
            content: content
        });
        await data.save();
        req.flash("success","cám ơn bạn đã chia sẻ sảm nhận của mình chúng tôi sẻ lắng nghe sự góp ý này.");       

    } catch (error) {
        req.flash("error", "Gửi thất bại vui lòng thử lại sau!!!")
    }
    res.redirect("back")
}