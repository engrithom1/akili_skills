const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var { v4:uuidv4 } = require("uuid")
var session = require('express-session');
const fileUpload = require('express-fileupload');
var path = require('path')
//const mysql = require('mysql');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 8000;

//image pload
app.use(fileUpload());
//parsing middleware
app.use(bodyParser.urlencoded({extended:false}))

//parse application.json
app.use(bodyParser.json());

//declare static file
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, '/uploads')));
//app.use(express.static('uploads'));

// initialize cookie-parser to allow us access the cookies stored in the browser. 
//app.use(cookieParser());

// initialize express-session to allow us track the logged-in user across sessions.
console.log('secret = '+uuidv4())
/*app.use(session({
    secret: uuidv4(),
    resave: false,
    saveUninitialized: true
}));*/
var sec = uuidv4()
app.use(session({
    secret: sec,
    resave: true,
    saveUninitialized: false,
}));
////////////handlebars register


//templating engine
const handlebars = exphbs.create({ extname: '.hbs', 
    helpers:{
        substr: function(len, context) {
            if ( context.length > len ) {
             return context.substring(0, len) + "...";
            } else {
             return context;
            }
        }
    }
});
app.engine('.hbs', handlebars.engine);
app.set('view engine', '.hbs');

// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use((req, res, next) => {
    if (!req.session.user) {
        req.session.user = {isLoged:false,user:{}}         
    }
    console.log("from app.js config")
    console.log(req.session.user)
    next();
});


//routers
const routes = require('./server/routers/routers')
app.use('/', routes)

app.listen(port, () => console.log(`listening on port ${port}`));