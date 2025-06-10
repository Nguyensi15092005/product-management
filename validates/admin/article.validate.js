module.exports.createPost=(req, res, next)=>{
    if(!req.body.title){  
        req.flash("error", "Vui lòng nhập tiêu đề bài viết!!!")
        res.redirect("back")
        return;
    }

    if(!req.body.content){  
        req.flash("error", "Vui lòng nhập nội dung bài viết!!!")
        res.redirect("back")
        return;
    }

    next();//hàm nexext để nó đi tiếp
    
}