const pool = require('../config/dbconfig')
const bcrypt = require('bcrypt')
var data = require('../data')

var userInfo = data.userInfo;

////constroller functions
exports.loginForm = (req, res)=>{
    console.log(req.session.user)
    res.render('auth/login',{title:"Login form"})
}

exports.registerForm = (req, res)=>{
    res.render('auth/register',{title:"Register form"})
}

//register
exports.register = (req, res) => {
    var { username, password, phone_number} = req.body;
    
    var logedUser = {isLoged:true, user:{username,phone_number}}
    //password cryption
    const salt = bcrypt.genSaltSync();
	password = bcrypt.hashSync(password, salt);
    //connect to DB
    pool.getConnection((err, connection) =>{
        if(err) throw err;
        //console.log('Connection as ID '+connection.threadId)

        //query
        connection.query('INSERT INTO users SET username = ? , password = ? , phone_number = ?',[username, password, phone_number], (err, rows) => {
            connection.release(); 
            if(!err){
                    req.session.user = logedUser;
                    res.redirect('/register');
                
            }else{
                res.redirect('/register');
                console.log(err);
            }
            
            //console.log('the data: \n',rows);
        })
    })

}


