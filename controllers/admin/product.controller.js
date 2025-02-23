const Product = require("../../models/product.model")
const filterStatusHelper = require("../../helper/filterStatus");
const searchHelper = require("../../helper/search");
const paginationHelper = require("../../helper/pagination");
const systemConfig = require("../../config/system");

// [GET] /admin/product
module.exports.index = async (req, res) => {
    // lọc để dò ptrạng thái của sản hẩm
    // console.log(req.query.keyword)
    // console.log(req.query)

    // phần bộ lọc sản phầm thêo trạng thái
    const filterStatus = filterStatusHelper(req.query);


    let find = {
        deleted: false,
    };

    // them key
    if (req.query.status) {
        find.status = req.query.status;
    }

    // phần tìm kiếm sản phẩm bằng thanh search
    const objectSearch = searchHelper(req.query);

    if (objectSearch.regex) {

        find.title = objectSearch.regex;
    }

    // pagination page phần số lượng sản phẩm mỗi trang
    const countPage = await Product.countDocuments(find);
    let objectPagenation = paginationHelper(
        {
            currentPage: 1,
            limitItems: 4
        },
        req.query,
        countPage
    )


    // end pagination page

    const products = await Product.find(find)
        .sort({ position: "desc" })
        .limit(objectPagenation.limitItems)
        .skip(objectPagenation.skip);
    // console.log(products);


    res.render("admin/pages/products/index", {
        pageTitle: "Danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagenation
    });
}

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;

    await Product.updateOne({ _id: id }, { status: status });

    req.flash("success", "Bạn đã thay đổi trạng thái thành công");

    res.redirect('back');

}

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");

    switch (type) {
        case "active":
            await Product.updateMany({ _id: { $in: ids } }, { status: "active" });
            req.flash("success", `Bạn đã thay đổi trạng thái hoạt động của ${ids.length} sản phẩm thành công`);
            break;
        case "inactive":
            await Product.updateMany({ _id: { $in: ids } }, { status: "inactive" });
            req.flash("success", `Bạn đã thay đổi trạng thái dừng hoạt động của ${ids.length} sản phẩm thành công`);
            break;
        case "delete-all":
            await Product.updateMany({ _id: { $in: ids } }, {
                deleted: true,
                deletedAt: new Date()
            });
            req.flash("success", `Bạn đã xóa thành công ${ids.length} sản phẩm`);
            break;
        case "change-position":
            for (const item of ids) {
                let [id, position] = item.split("-");
                position = parseInt(position);
                await Product.updateOne({ _id: id }, { position: position });
            }
            req.flash("success", `Bạn đã thay đổi vị trí của ${ids.length} sản phẩm thành công`);

            break;
        default:
            break;
    }


    res.redirect('back');

}

// [DELETE] /admin/products/delete
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;

    // xóa Vĩnh viễn
    // await Product.deleteOne({ _id: id });

    // xóa mềm thay dổi giá trị của daleteddaleted
    await Product.updateOne({ _id: id }, {
        deleted: true,
        deletedAt: new Date()

    });

    req.flash("success", "Bạn đã xóa sản phẩm thành công");

    res.redirect('back');
}

// [GET] /admin/products/create  để vẻ giao diện phần createcreate
module.exports.create = async (req, res) => {
    res.render("admin/pages/products/create", {
        pageTitle: "Tạo mới sản phẩm"
    });
}

// [POST] /admin/products/create  để gửi data của form create bằng POST 
module.exports.createPost = async (req, res) => {

    req.body.price = parseInt(req.body.price)
    req.body.discountPercentage = parseInt(req.body.discountPercentage)
    req.body.stock = parseInt(req.body.stock)

    if (req.body.position == "") {
        const countProduct = await Product.countDocuments();
        req.body.position = countProduct + 1
    }
    else {
        req.body.position = parseInt(req.body.position)
    }

    if (req.file) {
        req.body.thumbnail = `/uploads/${req.file.filename}`
    }


    const products = new Product(req.body)
    await products.save(req.body)

    res.redirect(`${systemConfig.prefixAdmin}/products/create`)
}


// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        }
    
        const product = await Product.findOne(find);
    
        res.render("admin/pages/products/edit", {
            pageTitle: "Chỉnh sửa sản phẩm",
            product: product
        });
    } catch (error) {
        req.flash("error", "Sản phẩm không tồn tại!!!");
        res.redirect(`${systemConfig.prefixAdmin}/products`)
    }
    
}

// [PATCH] /admin/products/edit/:id để chỉnh sửa sản phẩm 
module.exports.editPatch = async(req, res) =>{
    const id = req.params.id

    req.body.price = parseInt(req.body.price)
    req.body.discountPercentage = parseInt(req.body.discountPercentage)
    req.body.stock = parseInt(req.body.stock)
    req.body.position = parseInt(req.body.position)

    if (req.file) {
        req.body.thumbnail = `/uploads/${req.file.filename}`
    }
    
    try {
        await Product.updateOne({ _id: id}, req.body)
        req.flash("success", "bạn đã cập nhật sản phẩm thành công");
    } catch (error) {
        req.flash("error", "Bạn cập nhật sản phẩm thất bại");
    }

    res.redirect('back')
}

// [GET] /admin/products/detail/:id 
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        }
    
        const product = await Product.findOne(find);
        console.log(product)
    
        res.render("admin/pages/products/detail", {
            pageTitle: product.title,
            product: product
        });
    } catch (error) {
        req.flash("error", "Sản phẩm không tồn tại!!!");
        res.redirect(`${systemConfig.prefixAdmin}/products`)
    }
    
}
