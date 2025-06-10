const Prodcuts = require("../../models/product.model");
const productHelper = require("../../helper/products");
// [GET] /
module.exports.index = async (req, res) => {
    // lấy ra sản phẩm nổi bậtbật
    const productFeatured = await Prodcuts.find({
        featured: "1",
        deleted: false,
        status: "active"
    }).limit(6)
    const newProductsFeatured = productHelper.priceNewProduct(productFeatured);
    // End lấy ra sản phẩm nổi bậtbật

    // lấy ra sản phẩm mới nhất
    const productsNew = await Prodcuts.find({
        deleted: false,
        status: "active"
    }).sort({position: "desc"}).limit(6)

    const newProducts = productHelper.priceNewProduct(productsNew);
    // End lấy ra sản phẩm mới

    res.render("client/pages/home/index", {
        pageTitle: "Trang chu",
        productFeatured: newProductsFeatured,
        productsNew:newProducts
    });

} 