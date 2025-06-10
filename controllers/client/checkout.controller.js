const Carts = require("../../models/carts.model");
const Products = require("../../models/product.model");
const Order = require("../../models/order.model");
const productHelper = require("../../helper/products");


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

    res.render("client/pages/checkout/index", {
        pageTitle: "Đặt hàng",
        cartDetail: cart
    })
}

// [POST] /chechout/order
module.exports.order = async (req, res) => {
    const cartId = req.cookies.cartID;
    const userInfo = req.body;

    const cart = await Carts.findOne({
        _id: cartId
    });
    const products = [];
    for (const product of cart.products) {
        const objectProduct = {
            product_id: product.product_id,
            price: 0,
            discountPercentage: 0,
            quantity: product.quantity
        };

        const productInfo = await Products.findOne({
            _id: product.product_id
        }).select("price discountPercentage thumbnail title");

        objectProduct.price = productInfo.price;
        objectProduct.discountPercentage = productInfo.discountPercentage;
        objectProduct.thumbnail = productInfo.thumbnail
        objectProduct.title = productInfo.title

        products.push(objectProduct);
    }

    const orderInfo = {
        cart_id: cartId,
        userInfo: userInfo,
        products: products
    }

    const order = new Order(orderInfo);
    await order.save();


    await Carts.updateOne({
        _id: cartId,
    }, {
        products: []
    });


    res.redirect(`/checkout/success/${order.id}`);

}

// [GET] /cart/checkout/order
module.exports.success = async (req, res) => {

    const order = await Order.findOne({
        _id: req.params.orderId
    })



    for (const product of order.products) {
        const productInfo = await Products.findOne({
            _id: product.product_id
        }).select("title thumbnail");

        product.productInfo = productInfo;

        productHelper.newPriceProduct(product);

        product.totalPrice = product.priceNew * product.quantity;
    }

    order.totalPrice = order.products.reduce((sum, item) => sum + item.totalPrice, 0);
    console.log(order)

    res.render("client/pages/checkout/success", {
        pageTitle: "Đặt hàng thành công",
        order:order
    })

}

