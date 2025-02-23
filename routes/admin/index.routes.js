const systemConfig = require("../../config/system");

const dashboardRoutes = require("./dashboard.route");
const productRoutes = require("./product.route");
const sp_delete = require("./sp-delete.route");

module.exports = (app) => {
    const Admin = systemConfig.prefixAdmin
    app.use(Admin + '/dashboard', dashboardRoutes);

    app.use(Admin + '/products', productRoutes);

    app.use(Admin + '/sp-delete', sp_delete);

}