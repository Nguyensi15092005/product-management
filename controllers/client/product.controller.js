// nhúng model product và
const Product = require("../../models/product.model"); 

// [GET] /products
module.exports.index = async (req, res) => {
    const products = await Product.find({
        // điều kiện để lấy ra dao diện là chưa đc xóaxóa
        status:"active",
        deleted: false
    }).sort({ position: "desc"});//lấy data

    const newProducts = products.map(item => {
        item.priceNew = (item.price*(100 - item.discountPercentage)/100).toFixed(0);
        return item
    })

    // truền data qua controller để vẽ ra giao diện
    res.render("client/pages/products/index",{
        pageTitle: "Danh sach san pham",
        products:newProducts
    });
}

// [GET] /products/:slug
module.exports.detail= async(req, res) =>{
    try {
        const find ={
            deleted: false,
            slug:req.params.slug,
            status:"active"
        }
    
        const product = await Product.findOne(find);
    
        res.render("client/pages/products/detail", {
            pageTitle: "Chi tiết sản phẩm",
            product:product
        })
    } catch (error) {
        res.redirect("/products")
    }



}
