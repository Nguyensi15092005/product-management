const express = require('express')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')

//flash
const flash = require('express-flash')
const cookieParser = require('cookie-parser')
const session = require('express-session')




// câu lệnh này dùng để dùng dotenv
require("dotenv").config();

const database = require("./config/database")

const systemConfig = require("./config/system")

//nhung file routes vao
const routeAdmin = require("./routes/admin/index.routes");
const route = require("./routes/client/index.route");

database.connect();

const app = express()
const port = process.env.POST;

// thư viện method-override dùng để gi đè phương thức trong html
app.use(methodOverride('_method'))

// để lấy đc thuộc tính trong req.body
app.use(bodyParser.urlencoded({ extended: false }))

// flash 
app.use(cookieParser('SISISISISISISI'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
//end flash

app.use(express.static(`${__dirname}/public`))

// App locals Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;


// cau hinh pug de dung pug
app.set('views', `${__dirname}/views`)
app.set('view engine', 'pug')

// goi Routes
routeAdmin(app);
route(app);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)

})   