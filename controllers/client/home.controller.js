const Prodcuts = require("../../models/product.model");
const productHelper = require("../../helper/products");
const Sliders = require("../../models/sliders.model");
const Setting = require("../../models/settings-general.model");


// [GET] /
module.exports.index = async (req, res) => {
    try {
        // lấy ra sản phẩm nổi bậtbật
        const productFeatured = await Prodcuts.find({
            featured: "1",
            deleted: false,
            status: "active"
        }).limit(8)
        const newProductsFeatured = productHelper.priceNewProduct(productFeatured);
        // End lấy ra sản phẩm nổi bậtbật

        // lấy ra sản phẩm mới nhất
        const productsNew = await Prodcuts.find({
            deleted: false,
            status: "active"
        }).sort({ position: "desc" }).limit(8)

        const newProducts = productHelper.priceNewProduct(productsNew);
        // End lấy ra sản phẩm mới

        // lấy ra sliders
        const sliders = await Sliders.find({
            deleted: false,
            status: "active"
        })

        //lấy ra cái setting
        const setting = await Setting.findOne({
        })
        res.render("client/pages/home/index", {
            pageTitle: "Trang chu",
            productFeatured: newProductsFeatured,
            productsNew: newProducts,
            sliders: sliders,
            setting: setting
        });
    } catch (error) {

    }

} 