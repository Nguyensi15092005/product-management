const ArticleCategory = require("../models/articles-category.model");

module.exports.getSubCategory = async (parentID)=>{
    const getCategory = async (parentID) => {
        const subs = await ArticleCategory.find({
            parent_id:parentID,
            status: "active",
            deleted: false
        })
        let allSub=[...subs];
        for(const sub of subs){
            const childs = await getCategory(sub.id);
            allSub=allSub.concat(childs);
        }
        return allSub;
    }
    const result = await getCategory(parentID);
    return result;
}