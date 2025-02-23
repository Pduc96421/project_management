const express = require("express");

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


require("dotenv").config();

// database
const database = require("./config/database");
database.connect();

// app local
const systemConfig = require("./config/system");

// mongoose
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URL);

const route = require("./routers/client/index.route");
const routeaAdmin = require("./routers/admin/index.route");

const app = express();
const port = process.env.PORT;

app.use(methodOverride("_method"));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(`${__dirname}/public`)); // co the su dung public de show anh
                                   // file tĩnh 

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

// flash
app.use(cookieParser('Ducno96421'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
// end flash

// app local variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;

// Router
route(app);
routeaAdmin(app);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});