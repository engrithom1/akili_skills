// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
		console.log(req.session.user)
        res.redirect('/');
    } else {
        next();
    }    
};

var authChecker = (req, res, next) => {
    if (!req.session.user) {
		console.log(req.session.user)
        res.redirect('/register');
    } else {
        next();
    }    
};

module.exports = {sessionChecker, authChecker}