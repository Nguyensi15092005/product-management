const Order = require("../../models/order.model");
const paginationHelper = require("../../helper/pagination");
const productHelper = require("../../helper/products");
const systemconfig = require("../../config/system");

// [GET] admin/order/
module.exports.index = async (req, res) => {
  // pagination page phần số lượng sản phẩm mỗi trang
  const countPage = await Order.countDocuments({ deleted: false });
  let objectPagenation = paginationHelper(
    {
      currentPage: 1,
      limitItems: 4
    },
    req.query,
    countPage
  )
  // end pagination page
  const order = await Order.find({
    deleted: false
  })
    .limit(objectPagenation.limitItems)
    .skip(objectPagenation.skip);

  for (const item of order) {
    let totalPrice = 0;
    let totalQuantity = 0;
    item.products = item.products.map(items => {
      let priceNew = ((items.price * (100 - items.discountPercentage) / 100).toFixed(0)) * items.quantity;
      totalPrice += priceNew;
      totalQuantity += items.quantity
      return items
    })
    await Order.updateOne({
      _id: item.id
    }, {
      $set: {
        totalPrice: totalPrice,
        totalQuantity: totalQuantity
      }
    }
    );
  }



  res.render("admin/pages/order/index", {
    pageTitle: "Quản lý đơn hàng",
    order: order,
    pagination: objectPagenation
  })
}

// [PATCH] admin/order/change-status
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;
  try {
    await Order.updateOne({ _id: id }, { status: status });
    req.flash("success", "Thay đổi trạng thái đơn hàng thành công");
  } catch (error) {
    req.flash("error", "Thay đổi trạng thái thất bại");
  }
  res.redirect("back");
}

// [PATCH] admin/order/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");

  switch (type) {
    case "comfirm":
      await Order.updateMany({ _id: ids }, { status: "comfirm" });
      req.flash("success", "Thay đổi trạng thái đã xác nhận đơn hàng thành công");
      break;
    case "notcomfirm":
      await Order.updateMany({ _id: ids }, { status: "notcomfirm" });
      req.flash("success", "Thay đổi trạng thái chưa xác nhận đơn hàng thành công");
      break;
    default:
      break;
  }
  res.redirect("back");
}

// [GET] admin/order/detail
module.exports.detail = async (req, res) => {
  const id = req.params.id
  try {
    const order = await Order.findOne({
      deleted: false,
      _id: id
    });
    const newPrice = productHelper.priceNewProduct(order.products);
    console.log(newPrice);
    res.render("admin/pages/order/detail", {
      pageTitle: "Chi tiết đơn hàng",
      order: newPrice
    })
  } catch (error) {

  }
}

// [GET] admin/order/transport
module.exports.transport = async (req, res) => {
  req.flash("success", "Hãy chuẩn bị hàng đơn vị vận chuyển sẽ đến lấy hàng trong vòng 24h")
  res.redirect(`back`)
}

// [DELETE] admin/order/delete
module.exports.delete = async (req, res) => {
  console.log(req.params)
  res.send('OK')
  // try {
  //   const id = req.params.id;
  //   await Order.updateOne({ _id: id }, { deleted: true });
  //   req.flash("success", "Xóa thành công");
  // } catch (error) {
  //   req.flash("error", "Xóa thất bại");
  // }
  // res.redirect("back");
}