module.exports.createPost=(req, res, next)=>{
    if(!req.body.fullName){  
        req.flash("error", "vui lòng nhập họ tên!!!")
        res.redirect("back")
        return;
    }

    if(!req.body.email){  
        req.flash("error", "vui lòng nhập email!!!")
        res.redirect("back")
        return;
    }

    if(!req.body.password){  
        req.flash("error", "vui lòng nhập Mật khẩu!!!")
        res.redirect("back")
        return;
    }

    if(!req.body.phone){  
        req.flash("error", "vui lòng nhập Số điện thoại!!!")
        res.redirect("back")
        return;
    }

    next();//hàm nexext để nó đi tiếp
    
}


module.exports.editPatch=(req, res, next)=>{
    if(!req.body.fullName){  
        req.flash("error", "vui lòng nhập họ tên!!!")
        res.redirect("back")
        return;
    }

    if(!req.body.email){  
        req.flash("error", "vui lòng nhập email!!!")
        res.redirect("back")
        return;
    }

    if(!req.body.phone){  
        req.flash("error", "vui lòng nhập Số điện thoại!!!")
        res.redirect("back")
        return;
    }

    next();//hàm nexext để nó đi tiếp
    
}