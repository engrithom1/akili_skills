const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
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
//app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static('uploads'));

// initialize cookie-parser to allow us access the cookies stored in the browser. 
app.use(cookieParser());

// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
    key: 'user_sid',
    secret: 'somerandonstuffs',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));

//templating engine
const handlebars = exphbs.create({ extname: '.hbs', });
app.engine('.hbs', handlebars.engine);
app.set('view engine', '.hbs');

// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');        
    }
    next();
});


//routers
const routes = require('./server/routers/routers')
app.use('/', routes)

app.listen(port, () => console.log(`listening on port ${port}`));