const systemConfig = require("../../config/system");
const Accounts = require("../../models/account.model");
const Roles = require("../../models/role.model");

module.exports.requireAuth = async (req, res, next) => {
  if (!req.cookies.token) {
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
  }
  else {
    const user = await Accounts.findOne({ token: req.cookies.token }).select("-password");
    if (!user) {
      res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    }
    else {
      const role = await Roles.findOne({
        _id: user.role_id,

      }).select("title permissions");

      res.locals.user = user; //biến troàn cục trả về cho file pug
      res.locals.role = role;

      next();
    }
  }
}