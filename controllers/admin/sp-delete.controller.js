const Product = require("../../models/product.model");
const Accounts = require("../../models/account.model")
const searchHelper = require("../../helper/search");
const paginationHelper = require("../../helper/pagination");

// [GET] /admin/sp-delete
module.exports.index = async (req, res) => {


    let find = {
        deleted: true
    }

    //phần tìm kiếm search
    const objectSearch = searchHelper(req.query);
    if (objectSearch.regex) {
        find.title = objectSearch.regex
    }

    //phần phân trang sản phẩm pagination
    const countPage = await Product.countDocuments(find);
    let objectPagenation = paginationHelper(
        {
            currentPage: 1,
            limitItems: 6
        },
        req.query,
        countPage
    )



    let products = await Product.find(find).limit(objectPagenation.limitItems).skip(objectPagenation.skip);

    for (const product of products) {
        const user = await Accounts.findOne({
            _id: product.deletedBy.account_id
        });
        if(user){
            product.account_Fullname = user.fullName
        }
    }

    res.render("admin/pages/sp-delete/index", {
        pageTitle: "Trang sp_delete",
        products: products,
        keyword: objectSearch.keyword,
        pagination: objectPagenation
    });

}

// DELETE /admin/sp-delete/delete
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id
    await Product.deleteOne({ _id: id });

    res.redirect('back');
}

//PATCH /admin/sp-delete/khoiphucsp
module.exports.restoreItem = async (req, res) => {
    const id = req.params.id;
    await Product.updateOne({ _id: id }, { deleted: false });

    res.redirect('back');
}

// [PATCH] /admin/sp-delete/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");

    switch (type) {
        case "delete-all":
            await Product.deleteMany({ _id: { $in: ids } });
            req.flash("success", `Bạn đã xóa thành công ${ids.length} sản phẩm`);
            break;
        case "restore-all":
            await Product.updateMany({ _id: { $in: ids } }, {
                deleted: false,
                deletedBy: {
                    account_id: res.locals.user.id,
                    deletedAt: new Date()
                }
            });
            req.flash("success", `Bạn đã khôi phục thành công ${ids.length} sản phẩm`);
            break;
        default:
            break;
    }


    res.redirect('back');

}