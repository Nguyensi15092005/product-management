const Products = require("../../models/product.model");
const newPrice = require("../../helper/products")
module.exports.index=async (req, res)=>{
    const keyword = req.query.keyword;
    let newProduct=[]
    if(keyword){
        const regex = RegExp(keyword, "i");
        const products = await Products.find({
            title: regex,
            deleted:false,
            status: "active"
        })
        newProduct = newPrice.priceNewProduct(products)
    }
    res.render("client/pages/search/index",{
        pageTitle: "Kết quả tìm kiếm",
        keyword: keyword,
        products: newProduct 
    })
}