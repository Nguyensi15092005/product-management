const Carts = require("../../models/carts.model");
const Products = require("../../models/product.model");
const productHelper = require("../../helper/products");
const User = require("../../models/users.model");
const Cart = require("../../models/carts.model");
const Order = require("../../models/order.model");


module.exports.index = async (req, res) => {
    const cartId = req.cookies.cartID;
    const cart = await Carts.findOne({
        _id: cartId
    });
    if (cart.products.length > 0) {
        for (const item of cart.products) {
            const productId = item.product_id;
            const productInfo = await Products.findOne({
                _id: productId
            }).select("title thumbnail price discountPercentage position slug");;

            productHelper.newPriceProduct(productInfo)

            item.productInfo = productInfo;
            item.totalPrice = productInfo.priceNew * item.quantity;
        }
    }

    cart.totalPrice = cart.products.reduce((sum, item) => sum + item.totalPrice, 0);

    res.render("client/pages/cart/index", {
        pageTitle: "Giỏ hàng",
        cartDetail: cart
    })
}

// [POST] /cart/add/:productId
module.exports.addPost = async (req, res) => {
    const productId = req.params.productId;
    const quantity = parseInt(req.body.quantity);
    const cartId = req.cookies.cartID;

    const cart = await Carts.findOne({
        _id: cartId
    });
    const existProductInCart = cart.products.find(item => item.product_id == productId);
    if (existProductInCart) {
        const quantityNew = quantity + existProductInCart.quantity;
        await Carts.updateOne({
            _id: cartId,
            "products.product_id": productId
        }, {
            $set: {
                "products.$.quantity": quantityNew
            }
        });
    }
    else {
        const objectCart = {
            product_id: productId,
            quantity: quantity
        }

        await Carts.updateOne({ _id: cartId },
            {
                $push: { products: objectCart }
            });
    }

    req.flash("success", "Thêm vào dỏ hàng thành công");
    res.redirect("back");

} 

// [GET] /cart/delete/:productId
module.exports.delete = async (req, res) => {
    console.log(req.params.productId)
    const cartId = req.cookies.cartID;
    const productId = req.params.productId;

    await Carts.updateOne(
        {
           _id: cartId 
        },
        {
            $pull:{products:{product_id: productId}}
        }
    );

    req.flash("success", "Đã xóa sản phẩm khỏi giỏ hàng");
    res.redirect("back");

} 

// [GET] /cart/update/:productId/:quantity
module.exports.update = async (req, res) => {
    const cartId = req.cookies.cartID;
    const productId = req.params.productId;
    const quantity = req.params.quantity;

    await Carts.updateOne({
        _id: cartId,
        "products.product_id": productId
    }, {
        $set: {
            "products.$.quantity": quantity
        }
    });

    res.redirect("back");

} 

// [GET] /cart/order
module.exports.order = async (req, res) => {
    try {
        const tokenUser = req.cookies.tokenUser;
        if(!tokenUser){
            req.flash("error", "Đăng nhập để xem lịch sử mua hàng");
            res.redirect("/");
            return;
        }
        const user = await User.findOne({
            tokenUser: tokenUser,
            deleted: false
        });
        const cart = await Cart.findOne({
            user_id: user.id
        });
        const order = await Order.find({
            cart_id: cart.id
        });
        console.log(order);
        res.render("client/pages/cart/lichsumuahang", {
            pageTitle: "Lịch sử mua hàng",
            order: order.reverse()
        });
    } catch (error) {
        console.log("Lỗi order", error)
        req.flash("error", "Lỗi Order");
        res.redirect("/");
    }
}


