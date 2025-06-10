const productCategory = require("../../models/product-category.model")
const createTreeHelper = require("../../helper/createTree");
const ArticlesCategory = require("../../models/articles-category.model");

module.exports.category = async (req, res, next) =>{
    const productcategory = await productCategory.find({
        deleted:false
    });
    const newProductCategory= createTreeHelper.tree(productcategory);

    res.locals.layoutproduct= newProductCategory
    next();
}

module.exports.articles =async(req, res, next)=>{
    const articleCategory = await ArticlesCategory.find({
        deleted:false
    });
    const newProductCategory= createTreeHelper.tree(articleCategory);

    res.locals.layoutarticle= newProductCategory
    next();
}