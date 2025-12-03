const ProductCategory = require("../../models/product-category.model");
const productHelper = require("../../helper/products");
const productsCategoryHelper = require("../../helper/products-category");

const Product = require("../../models/product.model");

// [GET] /products
module.exports.index = async (req, res) => {
    const products = await Product.find({
        // điều kiện để lấy ra dao diện là chưa đc xóaxóa
        status: "active",
        deleted: false
    }).sort({ position: "desc" });//lấy data

    const newProducts = productHelper.priceNewProduct(products);
    // truền data qua controller để vẽ ra giao diện
    res.render("client/pages/products/index", {
        pageTitle: "Danh sach san pham",
        products: newProducts
    });
}

// [GET] /products/:slug
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            slug: req.params.slugProduct,
            status: "active"
        }

        const product = await Product.findOne(find);

        if(product.product_category_id){
            const categoryID = await ProductCategory.findOne({
                _id: product.product_category_id,
                deleted:false
            })

            product.category = categoryID
        }
        
        const productCategory = await Product.find({
            product_category_id: product.product_category_id,
            deleted: false
        });
        const newProudctCategory = productHelper.priceNewProduct(productCategory);
        

        productHelper.newPriceProduct(product)

        res.render("client/pages/products/detail", {
            pageTitle: "Chi tiết sản phẩm",
            product: product,
            newProudctCategory
        })
    } catch (error) {
        res.redirect("/products")
    }
}

// [GET] /products/:slugCategory
module.exports.category = async (req, res) => {
    try {

        const category = await ProductCategory.findOne({
            slug: req.params.slugCategory,
            status: "active",
            deleted: false
        })

       const listSubCategory = await productsCategoryHelper.getSubCategory(category.id);
       console.log(listSubCategory)
       const listSubCategoryID = listSubCategory.map(item => item.id);

        const products = await Prodcuts.find({
            product_category_id: {$in : [category.id, ...listSubCategoryID]},
            status: "active",
            deleted: false
        }).sort({ position: "desc" });

        const newProducts = productHelper.priceNewProduct(products);
  

        res.render("client/pages/products/index", {
            pageTitle: category.title,
            products: newProducts
        });


    } catch (error) {

    }
}

// [GET] /products/:slug
module.exports.addCart = async (req, res) => {
    console.log(req.params)
    try {
    } catch (error) {
        res.redirect("/products")
    }
}




