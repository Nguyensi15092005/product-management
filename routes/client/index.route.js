const productRoutes = require("./product.route");
const homeRoutes = require("./home.route");

const categoryMiddlewares = require("../../middlewares/client/category.middlewares");
const userMiddlewares = require("../../middlewares/client/user.middleware");
const settingGeneralMiddleware = require("../../middlewares/client/setting.middleware");
const authMiddleware= require("../../middlewares/client/auth.middleware");
const cartMiddleware = require("../../middlewares/client/cart.middleware");


const articlesRoutes = require("./articles.route");
const searchRoutes = require("./search.route");
const cartRouter = require("./carts.route");
const checkoutRouter = require("./checkout.route");
const userRouter = require("./users.route");
const chatRouter = require("./chat.route");
const userSocketRouter = require("./userSocket.route");
const roomchatRouter = require("./rooms-chat.route");


module.exports = (app)=>{
    app.use(categoryMiddlewares.category); // tất cả  cái dứi luono chạy qua categoryMiddlewares
    app.use(categoryMiddlewares.articles);
    app.use(cartMiddleware.cart);
    app.use(userMiddlewares.infoUser);
    app.use(settingGeneralMiddleware.setting);



    app.use('/', homeRoutes);
    
    app.use('/products', productRoutes);

    app.use('/articles', articlesRoutes);

    app.use('/search', searchRoutes);

    app.use('/cart', cartRouter);

    app.use('/checkout', checkoutRouter);

    app.use('/user', userRouter);

    app.use('/chat',authMiddleware.requireAuth, chatRouter);

    app.use('/userSocket',authMiddleware.requireAuth, userSocketRouter);

    app.use('/rooms-chat',authMiddleware.requireAuth, roomchatRouter);
    





}