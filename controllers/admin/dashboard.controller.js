const ProductCategory= require("../../models/product-category.model");
const Product = require("../../models/product.model");
const ActicleCategory = require("../../models/articles-category.model");
const Acticle= require("../../models/articles.model");
const Account = require("../../models/account.model");
const User = require("../../models/users.model"); 
const Slider = require("../../models/sliders.model");
const Order = require("../../models/order.model");

// [GET] /admin/dashboard
module.exports.dashboard = async (req, res) => {
    const statistic = {
        categoryProduct:{
            total: 0,
            active: 0,
            inactive: 0
        },
        product:{
            total: 0,
            active: 0,
            inactive: 0
        },
        categoryActicle:{
            total: 0,
            active: 0,
            inactive: 0
        },
        acticle:{
            total: 0,
            active: 0,
            inactive: 0
        },
        account:{
            total: 0,
            active: 0,
            inactive: 0
        },
        user:{
            total: 0,
            active: 0,
            inactive: 0
        },
        slider:{
            total: 0,
            active: 0,
            inactive: 0
        },
    }

    // Danh mục sản phẩm 
    statistic.categoryProduct.total= await ProductCategory.countDocuments({
        deleted: false
    })
    statistic.categoryProduct.active= await ProductCategory.countDocuments({
        deleted: false,
        status: "active"
    })
    statistic.categoryProduct.inactive= await ProductCategory.countDocuments({
        deleted: false,
        status: "inactive"
    })
    // sản phẩm 
    statistic.product.total= await Product.countDocuments({
        deleted: false,
    })
    statistic.product.active= await Product.countDocuments({
        deleted: false,
        status: "active"
    })
    statistic.product.inactive= await Product.countDocuments({
        deleted: false,
        status: "inactive"
    })
    // Danh mục bài viết
    statistic.categoryActicle.total= await ActicleCategory.countDocuments({
        deleted: false,
    })
    statistic.categoryActicle.active= await ActicleCategory.countDocuments({
        deleted: false,
        status: "active"
    })
    statistic.categoryActicle.inactive= await ActicleCategory.countDocuments({
        deleted: false,
        status: "inactive"
    })
    //Danh sách bài viết 
    statistic.acticle.total= await Acticle.countDocuments({
        deleted: false,
    })
    statistic.acticle.active= await Acticle.countDocuments({
        deleted: false,
        status: "active"
    })
    statistic.acticle.inactive= await Acticle.countDocuments({
        deleted: false,
        status: "inactive"
    })
     //Tài khoản admin 
     statistic.account.total= await Account.countDocuments({
        deleted: false,
    })
    statistic.account.active= await Account.countDocuments({
        deleted: false,
        status: "active"
    })
    statistic.account.inactive= await Account.countDocuments({
        deleted: false,
        status: "inactive"
    })
     //Tài khoản client
     statistic.user.total= await User.countDocuments({
        deleted: false,
    })
    statistic.user.active= await User.countDocuments({
        deleted: false,
        status: "active"
    })
    statistic.user.inactive= await User.countDocuments({
        deleted: false,
        status: "inactive"
    })

    //slider 
    statistic.slider.total= await Slider.countDocuments({
        deleted: false,
    })
    statistic.slider.active= await Slider.countDocuments({
        deleted: false,
        status: "active"
    })
    statistic.slider.inactive= await Slider.countDocuments({
        deleted: false,
        status: "inactive"
    })


    res.render("admin/pages/dashboard/index",{
        pageTitle: "Trang tong quan",
        statistic: statistic
    });
}

// [GET] /admin/dashboard/bieudo
module.exports.bieudo = async (req, res) => {
    try {
        const bieudo = await Order.aggregate([
        {
            $group: {
                _id: { 
                    $dateToString: { format: "%Y-%m", date: "$createdAt" }
                },
                totalRevenue: { $sum: "$totalPrice" },
                totalOrders: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
        ]);

        res.json(bieudo);
        
    } catch (error) {
        
    }
}
