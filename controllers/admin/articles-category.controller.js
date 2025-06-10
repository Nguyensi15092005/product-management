const ArticelsCategory = require("../../models/articles-category.model");
const Accounts = require("../../models/account.model");
const systemConfig = require("../../config/system");
const createTreHelper = require("../../helper/createTree");
const filterStatusHelper = require("../../helper/filterStatus");
const searchHelper = require("../../helper/search");

module.exports.index = async (req, res) => {
  const filterStatus = filterStatusHelper(req.query)

  const find = {
    deleted: false
  }

  // thay đổi cho key status
  if (req.query.status) {
    find.status = req.query.status;
  }

  // phần search form tìm kiếm
  const objectSearch = searchHelper(req.query);
  if (objectSearch.regex) {
    find.title = objectSearch.regex
  }


  const articles = await ArticelsCategory.find(find);

  for (const article of articles) {
    // Lấy ta người tạo
    const userCreate = await Accounts.findOne({
      _id: article.createdBy.account_id
    });
    if (userCreate) {
      article.account_Fullname = userCreate.fullName;
    }

    // lấy ra người chỉnh sửa
    const updatedBy = article.updatedBy.slice(-1)[0];
    if (updatedBy) {
      const userUpdate = await Accounts.findOne({
        _id: updatedBy.account_id
      });

      updatedBy.account_Fullname = userUpdate.fullName
    }
  }

  const newArticles = createTreHelper.tree(articles);

  res.render("admin/pages/articles-category/index", {
    pageTitle: "Danh mục bài viết",
    articles: newArticles,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
  })
}

module.exports.create = async (req, res) => {
  const find = {
    deleted: false
  }
  const articles = await ArticelsCategory.find(find);

  const newArticles = createTreHelper.tree(articles);
  res.render("admin/pages/articles-category/create", {
    pageTitle: "Thêm mới bài viết",
    articles: newArticles
  });
}

module.exports.createPost = async (req, res) => {
  const permissions = res.locals.role.permissions;
  if (permissions.includes("articles_create")) {
    if (req.body.position == "") {
      const count = await ArticelsCategory.countDocuments();
      req.body.position = count + 1;
    }
    else {
      req.body.position = parseInt(req.body.position);
    }
    req.body.createdBy = {
      account_id: res.locals.user.id,
      createdAt: new Date()
    }
    

    const articles = new ArticelsCategory(req.body);
    await articles.save();
    req.flash("success", "Tạo mới thành công")
    res.redirect(`${systemConfig.prefixAdmin}/articles-category`);
  }
  else {
    return;
  }


}


module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    await ArticelsCategory.updateOne({ _id: id }, {
      deleted: true,
      deletedBy: {
        account_id: res.locals.user.id,
        deletedAt: new Date()
      }
    })
    req.flash("success", "Bạn đã xóa sản phẩm thành công");
  } catch (error) {
    req.flash("error", "danh mục ko tồn tại");
  }
  res.redirect("back");
}

module.exports.changeStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.params.status;
    await ArticelsCategory.updateOne({ _id: id }, {
      status: status
    })
    req.flash("success", "thay đổi trạng thái thành công");
  } catch (error) {
    req.flash("error", "thay đổi trạng thái thất bại");
  }
  res.redirect("back");
}

module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const article = await ArticelsCategory.findOne({
      _id: id,
      deleted: false
    });
    const articles = await ArticelsCategory.find({
      deleted: false
    })
    res.render("admin/pages/articles-category/edit", {
      pageTitle: "chỉnh sủa danh mục bài viết",
      article: article,
      articles: articles
    })
  } catch (error) {
    req.flash("error", "Danh mục ko tồn tại")
    res.redirect(`${systemConfig.prefixAdmin}/articles`)
  }
}

module.exports.editPatch = async (req, res) => {
  const id = req.params.id;
  console.log(req.body.position)
  req.body.position = parseInt(req.body.position)


  if (req.file) {
    req.body.thumbnail = `/uploads/${req.file.filename}`
  }
  try {
    const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date()
    }
    await ArticelsCategory.updateOne({ _id: id }, {
      ...req.body,
      $push: { updatedBy: updatedBy }
    });
    req.flash("success", "Chỉnh sửa danh mục bài viết thành công");
  } catch (error) {
    req.flash("error", "Chỉnh sửa danh mục bài viết thất bại");
  }
  res.redirect("back");

}

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
      await ArticelsCategory.updateMany({ _id: { $in: ids } }, {
        status: type,
        $push: { updatedBy: updatedBy }
      });
      req.flash("success", "Bạn đã thay đổi trạng thái thành công");
      break;
    case "inactive":
      await ArticelsCategory.updateMany({ _id: { $in: ids } }, {
        status: type,
        $push: { updatedBy: updatedBy }
      });
      req.flash("success", "Bạn đã thay đổi trạng thái thành công");
      break;
    case "delete-all":
      await ArticelsCategory.updateMany({ _id: { $in: ids } }, {
        deleted: true,
        deletedAt: new Date
      });
      req.flash("success", "Bạn đã xóa sản phẩm thành công");
      break;

    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position)
        await ArticelsCategory.updateOne({ _id: id }, {
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

module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;
    const article = await ArticelsCategory.findOne({
      _id: id,
      deleted: false
    });
    const articles = await ArticelsCategory.find({
      deleted: false
    })
    res.render("admin/pages/articles/detail", {
      pageTitle: `${article.title}`,
      article: article,
      articles: articles
    })
  } catch (error) {
    req.flash("error", "Danh mục ko tồn tại")
    res.redirect(`${systemConfig.prefixAdmin}/articles`)
  }
}