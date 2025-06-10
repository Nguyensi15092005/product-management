const Articles = require("../../models/articles.model");
const Accounts = require("../../models/account.model");
const ArticlesCategory = require("../../models/articles-category.model");
const systemConfig = require("../../config/system");
const filterStatusHelper = require("../../helper/filterStatus");
const searchHelper = require("../../helper/search");
const createTreHelper = require("../../helper/createTree");
const paginationHelper = require("../../helper/pagination");
const pagination = require("../../helper/pagination");

// [GET] admin/articles
module.exports.index = async (req, res) => {
  const permissions = res.locals.role.permissions;
  if (permissions.includes("articles_view")) {
    const filterStatus = filterStatusHelper(req.query);

    const find = {
      deleted: false
    };

    // thay đổi cho key status
    if (req.query.status) {
      find.status = req.query.status;
    }

    // Phần search tìm kiếm
    const objectSearch = searchHelper(req.query);
    if(objectSearch.regex){
      find.title = objectSearch.regex;
    }

    // Phần phân trang pagination
    const countPage = await Articles.countDocuments(find);
    let objectPagenation = paginationHelper(
      {
        currentPage: 1,
        limitItems: 4
      },
      req.query,
      countPage
    )


    // sort
    let sort = {}
    if (req.query.sortkey && req.query.sortValue) {
        sort[req.query.sortkey] = req.query.sortValue;
    }
    else {
        sort.position = "desc";
    }

    const articles = await Articles.find(find)
      .sort(sort)
      .limit(objectPagenation.limitItems)
      .skip(objectPagenation.skip)
      ;

    for (const article of articles) {
      // lấy ra người tạo
      const usetCreate = await Accounts.findOne({
        _id: article.createdBy.account_id
      });
      if (usetCreate) {
        article.account_Fullname = usetCreate.fullName
      }

      // Lấy ra người sửa
      const updatedBy = article.updatedBy.slice(-1)[0];
      if (updatedBy) {
        const userUpdated = await Accounts.findOne({
          _id: article.createdBy.account_id
        });
        updatedBy.account_Fullname = userUpdated.fullName;

      }

    }

    res.render("admin/pages/articles/index", {
      pageTitle: "Bài viết",
      articles: articles,
      filterStatus: filterStatus,
      keyword: objectSearch.keyword,
      pagination: objectPagenation 
    });
  }
  else {
    return;
  }
}

// [GET] admin/articles/create
module.exports.create = async (req, res) => {
  const permissions = res.locals.role.permissions;
  if (permissions.includes("articles_create")) {

    const article = await ArticlesCategory.find({
      deleted: false
    });
    const newArticle = createTreHelper.tree(article)
    res.render("admin/pages/articles/create", {
      pageTitle: "Tạo mới bài viết",
      article: newArticle
    });
  }
  else {
    return;
  }
}

// [POST] admin/articles/create
module.exports.createPost = async (req, res) => {
  const permissions = res.locals.role.permissions;
  if (permissions.includes("articles_create")) {
    const count = await Articles.countDocuments();
    if (req.body.position == "") {
      req.body.position = count + 1;
    }
    else {
      req.body.position = parseInt(req.body.position);
    }

    req.body.createdBy = {
      account_id: res.locals.user.id
    }

    const articles = new Articles(req.body);
    await articles.save()

    req.flash("success", "Tạo mới bài viết thành công");
    res.redirect(`${systemConfig.prefixAdmin}/articles/create`)
  }
  else {
    return;
  }

}

// [PATCH] admin/articles/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const permissions = res.locals.role.permissions;
  if (permissions.includes("articles_edit")) {
    try {
      const status = req.params.status;
      const id = req.params.id;

      const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
      };

      await Articles.updateOne({ _id: id }, {
        status: status,
        $push: { updatedBy: updatedBy }
      });

      req.flash("success", `Thay đổi trạng thái ${status} Thành công`);
    } catch (error) {
      req.flash("error", `Thay đổi trạng thái thất bại`);
    }
    res.redirect("back");

  }
  else {
    return;
  }
}

// [DELETE] admin/articles/delete/:id
module.exports.delete = async (req, res) => {
  const permissions = res.locals.role.permissions;
  if (permissions.includes("articles_edit")) {
    const id = req.params.id;
    try {
      await Articles.updateOne({ _id: id }, {
        deleted: true,
        deletedBy: {
          account_id: res.locals.user.id,
          deletedAt: new Date()
        }

      });
      req.flash("success", "Xóa bài viết thành công");
    } catch (error) {
      req.flash("error", "Xóa bài viết thất bại");
    }
    res.redirect("back");
  }

}

// [GET] admin/articles/edit/:id
module.exports.edit = async (req, res) => {
  const permissions = res.locals.role.permissions;
  if (permissions.includes("articles_edit")) {
    try {
      const article = await Articles.findOne({
        _id: req.params.id,
        deleted: false
      });
      const category = await ArticlesCategory.find({
        deleted: false
      })

      const newCategory = createTreHelper.tree(category);

      res.render("admin/pages/articles/edit", {
        pageTitle: "Chỉnh sửa bài viết",
        article: article,
        category: newCategory
      });
    } catch (error) {

    }
  }
  else {
    return;
  }
}

// [PATCH] admin/articles/edit/:id
module.exports.editPatch = async (req, res) => {
  const permissions = res.locals.role.permissions;
  if (permissions.includes("articles_edit")) {
    try {
      const id = req.params.id;
      const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
      };

      await Articles.updateOne({ _id: id }, {
        ...req.body,
        $push: { updatedBy: updatedBy }
      })

      req.flash("success", "Chỉnh sửa bài viết thành công");
    } catch (error) {
      req.flash("error", "Chỉnh sửa bài viết thất bại")
    }

    res.redirect(`${systemConfig.prefixAdmin}/articles`)
  }
  else {
    return;
  }
}

// [GET] admin/articles/edit/:id
module.exports.detail = async (req, res) => {
  const permissions = res.locals.role.permissions;
  if (permissions.includes("articles_view")) {
    try {
      console.log(req.params);
      const article = await Articles.findOne({
        _id: req.params.id
      })

      res.render("admin/pages/articles/detail", {
        pageTitle: article.title,
        article: article
      });

    } catch (error) {
      req.flash("error", "Bài viết ko tồn tại");
      res.redirect("back")
    }
  }
  else {
    return;
  }
}

// [PATCH] admin/articles/change-status/:status/:id
module.exports.changeMulti = async (req, res) => {
  const permissions = res.locals.role.permissions;
  if (permissions.includes("articles_edit")) {
    try {
      const type = req.body.type;
      const ids = req.body.ids.split(", ");
      const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
      }

      switch (type) {
        case "active":
          await Articles.updateMany({_id: {$in: ids}}, {
            status: "active",
            $push: {updatedBy: updatedBy}
          })
          break;

        case "inactive":
          await Articles.updateMany({_id: {$in: ids}}, {
            status: "inactive",
            $push: {updatedBy: updatedBy}
          })
          break;

        case "delete-all":
          await Articles.updateMany({_id: {$in: ids}}, {
            deleted: true,
            $push: {updatedBy: updatedBy}
          })
          break;

        case "change-position":
          for (const item of ids) {
              let [id, position]=item.split("-");
              position = parseInt(position);
              await Articles.updateMany({_id: id}, {
                position: position,
                $push: {updatedBy: updatedBy}
              })
          }
          break;
      
        default:
          break;
      }

      req.flash("success",`Thành công`)
    } catch (error) {
      req.flash("error", `thất bại`);
    }
    res.redirect("back");

  }
  else {
    return;
  }
}

