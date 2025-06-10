const Aticles = require("../../models/articles.model");
const AticlesCategory = require("../../models/articles-category.model");
const articleCategoryHelper = require("../../helper/articles-category");
// [GET] /articles
module.exports.index = async (req, res) => {

    const article = await Aticles.find({
        deleted: false,
        status: "active"
    });

    res.render("client/pages/articles/index", {
        pageTitle: "Blog sản phẩm",
        article: article
    })
}

// [GET] /articles/:slugCategory
module.exports.category = async (req, res) => {
    try {
        const category = await AticlesCategory.findOne({
            slug: req.params.slugCategory,
            status: "active",
            deleted: false
        })

        const listSubCategory = await articleCategoryHelper.getSubCategory(category.id);
        const listSubCategoryID = listSubCategory.map(item => item.id)
        const articless = await Aticles.find({
            article_category_id: {$in: [category.id, ...listSubCategoryID]},})
        console.log(articless)

        const articles = await Aticles.find({
            article_category_id: {$in: [category.id, ...listSubCategoryID]},
            status: "active",
            deleted: false
        }).sort({position: "desc"});

        console.log(articles)
        res.render("client/pages/articles/index", {
            pageTitle: category.title,
            article: articles
        })
    } catch (error) {

    }
}

// [GET] /articles/detail/:slug
module.exports.detail = async (req, res) => {
    try {
        const article = await Aticles.findOne({
            slug: req.params.slug,
            deleted: false,
            status: "active"
        });
        if(article.article_category_id){
            const categoryId = await AticlesCategory.findOne({
                _id: article.article_category_id,
                deleted: false
            });
            article.category = categoryId
        }

        res.render("client/pages/articles/detail",{
            pageTitle: article.title,
            article: article
        });
    } catch (error) {
        
    }
}
