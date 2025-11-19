const { createVNPayUrl, sortObject } = require("../../helper/payment.helper");
const Order = require("../../models/order.model");
const Payment = require("../../models/payment.model");
const Carts = require("../../models/carts.model");
const Products = require("../../models/product.model");
const moment = require("moment");
const querystring = require("qs");
const crypto = require("crypto");
const productHelper = require("../../helper/products");

// module.exports.index = async (req, res) => {
//   try {
//     const orderId = req.params.orderId;

//     const order = await Order.findOne({
//       _id: orderId,
//     });
//     for (const product of order.products) {
//       productHelper.newPriceProduct(product);

//       product.totalPrice = product.priceNew * product.quantity;
//     }

//     order.totalPrice = order.products.reduce(
//       (sum, item) => sum + item.totalPrice,
//       0
//     );
//     order.totalQuantity = order.products.reduce(
//       (sum, item) => sum + item.quantity,
//       0
//     );
//     await Order.updateOne(
//       { _id: orderId },
//       { totalPrice: order.totalPrice, totalQuantity: order.totalQuantity }
//     );
//     console.log(order);
//     res.render("client/pages/payment/index", {
//       pageTitle: "Xác nhận thanh toán",
//       order: order.id,
//     });
//   } catch (error) {
//     console.log(error);
//     req.flash("error", "Lỗi payment");
//     res.redirect("/");
//   }
// };

module.exports.createPayment = async (req, res) => {
  try {
    const cartId = req.cookies.cartID;
    const userInfo = req.body;

    const cart = await Carts.findOne({
      _id: cartId,
    });
    const products = [];
    const array = [];
    for (const product of cart.products) {
      const objectProduct = {
        product_id: product.product_id,
        price: 0,
        discountPercentage: 0,
        quantity: product.quantity,
      };

      const objectoPriceQuantity = {
        totalPrice: 0,
      };

      const productInfo = await Products.findOne({
        _id: product.product_id,
      }).select("price discountPercentage thumbnail title");

      objectProduct.price = productInfo.price;
      objectProduct.discountPercentage = productInfo.discountPercentage;
      objectProduct.thumbnail = productInfo.thumbnail;
      objectProduct.title = productInfo.title;
      products.push(objectProduct);
      productHelper.newPriceProduct(objectProduct);
      objectoPriceQuantity.totalPrice =
        objectProduct.priceNew * objectProduct.quantity;
      array.push(objectoPriceQuantity);
    }

    const newTotalPrice = array.reduce((sum, item) => sum + item.totalPrice, 0);
    const newTotalQuantity = products.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    const orderInfo = {
      cart_id: cartId,
      userInfo: userInfo,
      products: products,
      totalQuantity: newTotalQuantity,
      totalPrice: newTotalPrice,
    };

    const order = new Order(orderInfo);
    await order.save();
    // console.log(order);

    process.env.TZ = "Asia/Ho_Chi_Minh";

    let date = new Date();
    let createDate = moment(date).format("YYYYMMDDHHmmss");

    let ipAddr = "127.0.0.1";

    let tmnCode = process.env.VNPAY_TMNCODE;
    let secretKey = process.env.VNPAY_HASH_SECRET;
    let vnpUrl = process.env.VNPAY_URL;
    let returnUrl = `${process.env.BASE_URL}/payment/vnpay`;
    let orderId = order.id;
    let amount = order.totalPrice;

    let locale = "vn";
    let currCode = "VND";
    let vnp_Params = {};
    vnp_Params["vnp_Version"] = "2.1.0";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = tmnCode;
    vnp_Params["vnp_Locale"] = locale;
    vnp_Params["vnp_CurrCode"] = currCode;
    vnp_Params["vnp_TxnRef"] = orderId;
    vnp_Params["vnp_OrderInfo"] = "Thanh toan don hang";
    vnp_Params["vnp_OrderType"] = "other";
    vnp_Params["vnp_Amount"] = amount * 100;
    vnp_Params["vnp_ReturnUrl"] = returnUrl;
    vnp_Params["vnp_IpAddr"] = ipAddr;
    vnp_Params["vnp_CreateDate"] = createDate;
    vnp_Params["vnp_BankCode"] = "NCB"; 

    vnp_Params = sortObject(vnp_Params);

    let signData = querystring.stringify(vnp_Params, { encode: false });

    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
    vnp_Params["vnp_SecureHash"] = signed;
    vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });
    console.log(vnpUrl);
    res.redirect(vnpUrl);
  } catch (error) {
    console.log(error);
    req.flash("error", "Lỗi thanh toán VNPay");
    res.redirect("/");
  }
};

module.exports.vnpayReturn = async (req, res) => {
  try {
    const cartId = req.cookies.cartID;
    let vnp_Params = req.query;
    const secureHash = vnp_Params.vnp_SecureHash;

    delete vnp_Params.vnp_SecureHash;
    delete vnp_Params.vnp_SecureHashType;
    vnp_Params = sortObject(vnp_Params);

    let tmnCode = process.env.VNPAY_TMNCODE;
    let secretKey = process.env.VNPAY_HASH_SECRET;

    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    if (secureHash === signed) {
      if (vnp_Params.vnp_ResponseCode === "00") {

        console.log("id do hang",cartId)
        await Carts.updateOne(
          {
            _id: cartId,
          },
          {
            products: [],
          }
        );

        await Order.updateOne(
          {
            _id: vnp_Params.vnp_TxnRef,
          },
          {
            paymentStatus: true,
          }
        );
        const paymentData = {
          order_id: vnp_Params.vnp_TxnRef,
          amount: vnp_Params.vnp_Amount / 100, // chia lại về VNĐ thật
          vnp_BankCode: vnp_Params.vnp_BankCode,
          vnp_TransactionNo: vnp_Params.vnp_TransactionNo,
          vnp_ResponseCode: vnp_Params.vnp_ResponseCode,
        };

        const dataPayment = new Payment(paymentData);
        await dataPayment.save();

        res.render("client/pages/payment/success", {
          pageTitle: "Thạnh toán thành công"
        });
      } else {
        console.log("Không lưu đc vào db");
        res.render("client/pages/payment/error", {
          pageTitle: "Thanh toán thất bại",
        });
      }
    } else {
      console.log("Chọn khồn thanh toán");
      res.render("client/pages/payment/error", {
        pageTitle: "Thanh toán thất bại",
      });
    }
  } catch (error) {
    req.flash("error", "Thanh toán thất bại");
    res.redirect("/");
  }

};
