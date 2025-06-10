module.exports.createPost=(req, res, next)=>{
    if(!req.body.title){  
        req.flash("error", "vui lòng nhập tiêu đề bài viết!!!");
        res.redirect("back");
        return;
    }

    next();//hàm nexext để nó đi tiếp
    
}