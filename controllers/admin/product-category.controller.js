const ProductCategory = require("../../models/product-category.model");
const Accounts = require("../../models/account.model");
const systemConfig = require("../../config/system");
const filterStatusHelper = require("../../helper/filterStatus");
const searchHelper = require("../../helper/search");
const paginationHelper = require("../../helper/pagination");
const createTreHelper = require("../../helper/createTree");


// [GET] /admin/products-category
module.exports.index = async (req, res) => {

    const filterStatus = filterStatusHelper(req.query)

    let find = {
        deleted: false,
    };

    // thay đổi cho key status
    if (req.query.status) {
        find.status = req.query.status;
    }

    // phần search form tìm kiếm
    const objectSearch = searchHelper(req.query);
    if (objectSearch.regex) {
        find.title = objectSearch.regex
    }

    // Phần phân trang pagination
    // const countPage = await ProductCategory.countDocuments(find);
    // let objectPagenation = paginationHelper(
    //     {
    //         currentPage: 1,
    //         limitItems: 6

    //     },
    //     req.query,
    //     countPage
    // )


    // Sort
    const sort = {}
    if (req.query.sortkey && req.query.sortValue) {
        sort[req.query.sortkey] = req.query.sortValue
    }
    else {
        sort.position = "desc"
    }
    // End Sort


    const productsCategory = await ProductCategory.find(find)
        .sort(sort)
        // .limit(objectPagenation.limitItems)
        // .skip(objectPagenation.skip);

    for (const category of productsCategory) {
        // lấy ra người tạo
        const userCreate = await Accounts.findOne({
            _id: category.createdBy.account_id
        })
        if (userCreate) {
            category.account_Fullname = userCreate.fullName
        }

        // lấy ra người chỉnh sửa
        const updatedBy = category.updatedBy.slice(-1)[0];
        if (updatedBy) {
            const userUpdatedBy = await Accounts.findOne({
                _id: updatedBy.account_id
            })
            updatedBy.account_Fullname = userUpdatedBy.fullName
        }
    }

    // Goi Tree
    const newcategory = createTreHelper.tree(productsCategory);


    res.render("admin/pages/products-category/index", {
        pageTitle: "Danh mục sản phẩm",
        category: newcategory,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        // pagination: objectPagenation
    });
}

// [GET] /admin/products-category/create
module.exports.create = async (req, res) => {
    const find = {
        deleted: false
    }

    const category = await ProductCategory.find(find);

    const newcategory = createTreHelper.tree(category);

    res.render("admin/pages/products-category/create", {
        pageTitle: "Tạo danh mục sản phẩm",
        category: newcategory
    });
}


// [POST] /admin/products-category/create  để gửi data của form create bằng POST 
module.exports.createPost = async (req, res) => {
    const permissions = res.locals.role.permissions;
    if (permissions.includes("products-category_create")) {
        if (req.body.position == "") {
            const count = await ProductCategory.countDocuments();
            req.body.position = count + 1;
        }
        else {
            req.body.position = parseInt(req.body.position);
        }

        req.body.createdBy = {
            account_id: res.locals.user.id
        };

        const productsCategory = new ProductCategory(req.body);
        await productsCategory.save();


        req.flash("success", "Tạo mới danh mục san phâmr thành công thành ")
        res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    }
    else {
        return;
    }


}

// [PATCH] /admin/products-category/change-status/:status/:id
module.exports.changStatus = async (req, res) => {
    const id = req.params.id;
    const status = req.params.status;

    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    };
    await ProductCategory.updateOne({ _id: id }, {
        status: status,
        $push: { updatedBy: updatedBy }
    });
    req.flash("success", "Bạn đã thay đổi trạng thái thành công")
    res.redirect("back")
}

// [DELETE] /admin/products-category/delete/:id
module.exports.delete = async (req, res) => {
    try {
        const id = req.params.id;

        await ProductCategory.updateOne({ _id: id }, {
            deleted: true,
            deletedBy: {
                account_id: res.locals.user.id,
                deletedAt: new Date()
            }
        });
        req.flash("success", "Bạn đã xóa sản phẩm thành công");
    } catch (error) {
        req.flash("error", "danh mục ko tồn tại");
    }
    res.redirect("back");
}

// [PATCH] /admin/products-category/change-multi
module.exports.changeMulti = async (req, res) => {
    console.log(req.body);
    const type = req.body.type;
    const ids = req.body.ids.split(", ");


    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    };
    switch (type) {
        case "active":
            await ProductCategory.updateMany({ _id: { $in: ids } }, {
                status: type,
                $push: { updatedBy: updatedBy }
            });
            req.flash("success", "Bạn đã thay đổi trạng thái thành công");
            break;
        case "inactive":
            await ProductCategory.updateMany({ _id: { $in: ids } }, {
                status: type,
                $push: { updatedBy: updatedBy }
            });
            req.flash("success", "Bạn đã thay đổi trạng thái thành công");
            break;
        case "delete-all":
            await ProductCategory.updateMany({ _id: { $in: ids } }, {
                deleted: true,
                deletedAt: new Date
            });
            req.flash("success", "Bạn đã xóa sản phẩm thành công");
            break;

        case "change-position":
            for (const item of ids) {
                let [id, position] = item.split("-");
                position = parseInt(position)
                await ProductCategory.updateOne({ _id: id }, {
                    position: position,
                    $push: { updatedBy: updatedBy }
                });
            }
            req.flash("success", "Bạn đã thay đổi vị trí thành công");
            break;

        default:
            break;
    }

    res.redirect("back");
}

// [GET] /admin/products-category/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        }

        const productsCategory = await ProductCategory.findOne(find);

        const category = await ProductCategory.find({
            deleted: false
        });


        res.render("admin/pages/products-category/detail", {
            pageTitle: productsCategory.title,
            productsCategory: productsCategory,
            category: category

        });

    } catch (error) {
        req.flash("error", "Danh mục ko tồn tại");
        res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    }
}

// [GET] /admin/products-category/edit/:id 
module.exports.edit = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        }

        const findcategory = {
            deleted: false
        }


        const productsCategory = await ProductCategory.findOne(find);
        const category = await ProductCategory.find(findcategory);

        const newCategory = createTreHelper.tree(category);


        res.render("admin/pages/products-category/edit", {
            pageTitle: productsCategory.title,
            productsCategory: productsCategory,
            category: newCategory

        });

    } catch (error) {
        req.flash("error", "Sản phẩm ko tồn tại");
        res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    }
}

// [PATCH] /admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id
    console.log(req.params.id)
    req.body.position = parseInt(req.body.position)

    if (req.file) {
        req.body.thumbnail = `/uploads/${req.file.filename}`
    }

    try {
        const updatedBy = {
            account_id: res.locals.user.id,
            updatedAt: new Date()
        };
        await ProductCategory.updateOne({ _id: id }, {
            ...req.body,
            $push: { updatedBy: updatedBy }
        })
        req.flash("success", "bạn đã cập nhật danh mục thành công");
    } catch (error) {
        req.flash("error", "Bạn cập nhật danh mục thất bại");
    }

    res.redirect('back')
}