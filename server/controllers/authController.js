const pool = require('../config/dbconfig')
const bcrypt = require('bcrypt')
var data = require('../data')

var userInfo = data.userInfo;

////constroller functions
exports.loginForm = (req, res)=>{
    //console.log(req.session.user)
    res.render('auth/login',{title:"Login form"})
}

exports.registerForm = (req, res)=>{
    res.render('auth/register',{title:"Register form"})
}

//register
exports.register = (req, res) => {
    var { username, password, phone_number,path} = req.body;
    
    //password cryption
    const salt = bcrypt.genSaltSync();
	password = bcrypt.hashSync(password, salt);
    //connect to DB
    pool.getConnection((err, connection) =>{
        if(err) throw err;
        ///check if user exist
        connection.query('SELECT * FROM users WHERE username = ?',[username], (err, rows) => { 
            if(!err){
                if(rows.length == 0){
                    //inser query
                    connection.query('INSERT INTO users SET username = ? , password = ? , phone_number = ?',[username, password, phone_number], (err, rows) => {
                        if(!err){
                            var id = rows.insertId
                            connection.query('SELECT * FROM users WHERE id = ?',[id], (err, rows) => { 
                                if(!err){
                                    //console.log(rows)
                                    var role = rows[0].role
                                    var subscription = rows[0].subscription
                                    var avator = rows[0].avator
                                    var id = rows[0].id
                                    var phone_number = rows[0].phone_number
                                    var logedUser = {isLoged:true, user:{username,role,subscription,avator,id,phone_number}}

                                    req.session.user = logedUser;
                                    //console.log(logedUser)
                                    res.redirect(path);
                                    
                                }else{
                                    res.redirect('/login');  
                                }
                                //req.session.user = logedUser;
                                //res.redirect('/register'); 
                            })        
                        }else{
                            console.log(err);
                            res.redirect('/register');
                            
                        }
                    })
                    
                }else{
                    console.log('user exist');
                    res.redirect('/register');
                }
            }else{
                console.log('server error');
                res.redirect('/register');
            }
        })
       
    })

}

exports.login = (req, res) => {
    var { username, password, path} = req.body;
    
    //connect to DB
    pool.getConnection((err, connection) =>{
        if(err) throw err;
        //console.log('Connection as ID '+connection.threadId)

        //query
        connection.query('SELECT * FROM users WHERE username = ?',[username], (err, rows) => { 
            if(!err){
                if(rows.length != 0){
                    var pass = rows[0].password
                    if(password != pass){
                        //console.log(rows)
                        var role = rows[0].role
                        var subscription = rows[0].subscription
                        var avator = rows[0].avator
                        var id = rows[0].id
                        var phone_number = rows[0].phone_number
                        var logedUser = {isLoged:true, user:{username,role,subscription,avator,id,phone_number}}

                        req.session.user = logedUser;
                        //console.log(logedUser)
                        res.redirect(path);
                        
                    }else{
                        console.log('password miss match')
                        res.redirect('/login');
                    }
                    
                }else{
                    console.log('user not exist')
                    res.redirect('/login');
                }

            }else{
                res.redirect('/login');
                console.log(err);
            }
            
            //console.log('the data: \n',rows);
        })
    })

}

exports.logout = (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        console.log(req.cookies.user_sid)
		req.session.user = userInfo;
        res.clearCookie('user_sid');
        res.redirect('/');
    } else {
        console.log(req.cookies.user_sid)
        res.redirect('/account');
    }
}


