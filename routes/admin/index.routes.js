const systemConfig = require("../../config/system");
const authMiddleware = require("../../middlewares/admin/auth.middleware");

const dashboardRoutes = require("./dashboard.route");
const productRoutes = require("./product.route");
const sp_delete = require("./sp-delete.route");
const productCategoryRoutes = require("./product-category.routes")
const rolesRoutes = require("./role.route");
const accountsRouter = require("./accounts.route");
const authRouter = require("./auth.route");
const myAccountRouter = require("./my-account.route");
const articleCategoryRouter = require("./articles-category.route");
const articleRouter = require("./acticles.route");
const settingGeneralRouter = require("./settings-general.route");
const orderRouter = require("./orders.route");
const UserRouter = require("./user.route");
const SliderRouter = require("./sliders.route");









module.exports = (app) => {
    const Admin = systemConfig.prefixAdmin
    app.use(Admin + '/dashboard', authMiddleware.requireAuth, dashboardRoutes);

    app.use(Admin + '/products', authMiddleware.requireAuth, productRoutes);

    app.use(Admin + '/sp-delete', authMiddleware.requireAuth, sp_delete);

    app.use(Admin + '/products-category', authMiddleware.requireAuth, productCategoryRoutes)

    app.use(Admin + '/roles', authMiddleware.requireAuth, rolesRoutes);

    app.use(Admin + '/accounts', authMiddleware.requireAuth, accountsRouter);

    app.use(Admin + '/auth', authRouter);

    app.use(Admin + '/my-account', authMiddleware.requireAuth, myAccountRouter);

    app.use(Admin + '/articles-category', authMiddleware.requireAuth, articleCategoryRouter);

    app.use(Admin + '/articles', authMiddleware.requireAuth, articleRouter);

    app.use(Admin + '/setting', authMiddleware.requireAuth, settingGeneralRouter);

    app.use(Admin + '/order', authMiddleware.requireAuth, orderRouter);

    app.use(Admin + '/user', authMiddleware.requireAuth, UserRouter);

    app.use(Admin + '/sliders', authMiddleware.requireAuth, SliderRouter);







}