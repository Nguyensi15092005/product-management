const express = require('express')
const path = require('path');
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const http = require('http');
const { Server } = require("socket.io");

//flash
const flash = require('express-flash')

// momment
const moment = require('moment')
const cookieParser = require('cookie-parser');
const session = require('express-session');

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

// socket.io
const server = http.createServer(app);
const io = new Server(server);
global._io = io;
// End socket.io

// thư viện method-override dùng để gi đè phương thức trong html
app.use(methodOverride('_method'))

// để lấy đc thuộc tính trong req.body
app.use(bodyParser.urlencoded({ extended: false }))

// flash 
app.use(cookieParser('SISISISISISISI'));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());
//end flash

// TinyMCE
app.use(
    '/tinymce',
    express.static(path.join(__dirname, 'node_modules', 'tinymce'))
);
// End TinyMCE

app.use(express.static(`${__dirname}/public`))

// App locals Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;



// cau hinh pug de dung pug
app.set('views', `${__dirname}/views`)
app.set('view engine', 'pug')

// goi Routes
routeAdmin(app);
route(app);
app.get("*", (req, res) => {
    res.render("client/pages/errors/404", {
        pageTitle: "404 Not Found",
    });
})


server.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})   