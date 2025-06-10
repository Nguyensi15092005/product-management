module.exports.registerPost=(req, res, next)=>{
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

    next();//hàm nexext để nó đi tiếp
    
}

module.exports.loginPost=(req, res, next)=>{
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

    next();//hàm nexext để nó đi tiếp
    
}

module.exports.logoutPost=(req, res, next)=>{
    if(!req.body.email){  
        req.flash("error", "vui lòng nhập email!!!")
        res.redirect("back")
        return;
    }
    next();//hàm nexext để nó đi tiếp
    
}

module.exports.otpPasswordPost=(req, res, next)=>{
    if(!req.body.otp){  
        req.flash("error", "vui lòng nhập email!!!")
        res.redirect("back")
        return;
    }
    next();//hàm nexext để nó đi tiếp
    
}

module.exports.resetPasswordPost=(req, res, next)=>{
    if(!req.body.password){  
        req.flash("error", "vui lòng nhập mật khẩu!!!")
        res.redirect("back")
        return;
    }

    if(!req.body.comfirmpassword){  
        req.flash("error", "vui lòng nhập lại mật khẩu!!!")
        res.redirect("back")
        return;
    }

    if(req.body.password !== req.body.comfirmpassword){
        req.flash("error", "Mật khẩu không khớp!!!")
        res.redirect("back")
        return;
    }
    next();//hàm nexext để nó đi tiếp
    
}