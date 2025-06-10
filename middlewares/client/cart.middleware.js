const Carts= require("../../models/carts.model");

module.exports.cart = async (req, res, next) =>{
    if(!req.cookies.cartID){
        // tạo dỏ hàng
        const cart = new Carts();
        await cart.save();
        const expiresCookie = 1000 * 60 *60 * 24 *10

        res.cookie("cartID", cart.id,{
            expires: new Date(Date.now() + expiresCookie)
        });
    }
    else{
        const cart =await Carts.findOne({
            _id:req.cookies.cartID
        });
        // cart.totalQuantity = cart.products.length  Số lượng sản phẩm đc thêm
        cart.totalQuantity = cart.products.reduce((sum, item)=> sum+ item.quantity,0);
        res.locals.miniCart = cart;
    }

    next()
};