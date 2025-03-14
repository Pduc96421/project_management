const express = require("express");

const moment = require("moment");

const path = require("path"); // tinymce

// cookie-parser
const cookieParser = require("cookie-parser");

// express-session
const session = require("express-session");

// express-flash
const flash = require("express-flash");

//body-parser
const bodyParser = require("body-parser");

// method override (trong pug dùng được patch)
const methodOverride = require("method-override");

// socket.io
const http = require("http");
const { Server } = require("socket.io");

require("dotenv").config();

// app local
const systemConfig = require("./config/system");

// mongoose
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URL);

// database
const database = require("./config/database");
database.connect();

const routeClient = require("./routers/client/index.route");
const routeaAdmin = require("./routers/admin/index.route");

const app = express();
const port = process.env.PORT;

app.use(methodOverride("_method"));

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.static(`${__dirname}/public`)); // co the su dung public de show anh
// file tĩnh 

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

// socketIO
const server = http.createServer(app);
const io = new Server(server);
global._io = io;

// flash
app.use(cookieParser('Ducno96421'));
app.use(session({
    cookie: {
        maxAge: 60000
    }
}));
app.use(flash());
// end flash

// TinyMCE
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
// end TinyMCE

// app local variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;

// Router
routeClient(app);
routeaAdmin(app);

app.get("*", (req, res) => {
    res.render("client/pages/errors/404", {
        pageTitle: "404 Not Found",
    });
});

server.listen(port, () => {
    console.log(`App listening on port ${port}`);
});