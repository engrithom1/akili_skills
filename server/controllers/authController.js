const pool = require('../config/dbconfig')
const bcrypt = require('bcrypt');
var data = require('../data')

var userInfo = data.userInfo;

////constroller functions
exports.loginForm = (req, res)=>{
    //console.log(req.session.user)
    if(req.session.flag == 1){
        req.session.destroy();
        res.render('auth/login',{title:"Login form",message:"Password miss match"})
    }else if(req.session.flag == 2){
        req.session.destroy();
        res.render('auth/login',{title:"Login form",message:"Incorrect Username"})
    }else if(req.session.flag == 3){
        req.session.destroy();
        res.render('auth/login',{title:"Login form",message:"Server error try again"})
    }else{
        res.render('auth/login',{title:"Login form"})
    }
    
}

exports.registerForm = (req, res)=>{
    if(req.session.flag == 1){
        req.session.destroy();
        res.render('auth/register',{title:"Register form",message:"Username already exist"})
    }else if(req.session.flag == 2){
        req.session.destroy();
        res.render('auth/register',{title:"Register form",message:"Server error try again"})
    }else{
        res.render('auth/register',{title:"Register form"})
    }
    
}

//register
exports.register = (req, res) => {
    var { username, password, phone_number,path} = req.body;
   
    //password cryption
    //const salt = bcrypt.genSaltSync();
	//password = bcrypt.hashSync(password, salt);
    //var hashPassword = bcrypt.hashSync(password, 10);
    //connect to DB
    
   
    pool.getConnection((err, connection) =>{
        if(err) throw err;
        ///check if user exist
        connection.query('SELECT * FROM users WHERE username = ?',[username], (err, rows) => { 
            if(!err){
                if(rows.length == 0){
                    //inser query
                    bcrypt.hash(password, 10, function(err, hash) {
                        connection.query('INSERT INTO users SET username = ? , password = ? , phone_number = ?',[username, hash, phone_number], (err, rows) => {
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
                                        if(path){
                                            res.redirect(path);
                                        }else{
                                            res.redirect('/account');
                                        }
                                        
                                    }else{
                                        res.redirect('/login');  
                                    }
                                    //req.session.user = logedUser;
                                    //res.redirect('/register'); 
                                })        
                            }else{
                                req.session.flag = 2
                                console.log(err);
                                res.redirect('/register');
                                
                            }
                        })
                      });
                    
                   
                }else{
                    req.session.flag = 1    
                    console.log('user exist');
                    res.redirect('/register');
                }
            }else{
                req.session.flag = 2
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
                    console.log(pass+", "+password)
                   
                    /*hashedPassword = bcrypt.compareSync(password, pass)
                    console.log("passs this "+hashedPassword)
                    bcrypt.compare(password, pass, function(err, result) {
                        console.log("wow totale newwwww")
                        console.log(result)
                    });

                    bcrypt.compare(password, pass).then(function(result) {
                        console.log("wow totale newwwww plomise")
                        console.log(result)
                    });

                    bcrypt.compare(password, pass, function(err, res) {
                       
                        console.log("wow wow new one")
                        console.log(res)
                    });*/
                    
                    var doMatch = bcrypt.compareSync(password, pass)

                        if(doMatch){
                            var role = rows[0].role
                            var subscription = rows[0].subscription
                            var avator = rows[0].avator
                            var id = rows[0].id
                            var phone_number = rows[0].phone_number
                            var logedUser = {isLoged:true, user:{username,role,subscription,avator,id,phone_number}}

                            req.session.user = logedUser;
                            //after login
                            console.log('after login')
                            console.log(req.session.user)
                            if(path){
                                res.redirect(path);
                            }else{
                                res.redirect('/account');
                            }
                        }else{
                            req.session.flag = 1
                            console.log('password miss match')
                            res.redirect('/login');
                        }
                   

                   
                    
                }else{
                    req.session.flag = 2
                    console.log('user not exist')
                    res.redirect('/login');
                }

            }else{
                req.session.flag = 3
                res.redirect('/login');
                console.log(err);
            }
            
            //console.log('the data: \n',rows);
        })
    })

}

exports.logout = (req, res) => {
    if (req.session.user) {
		req.session.user = {isLoged:false,user:{}};
        console.log("ater log outtttttttttt")
        console.log(req.session.user)
        
        res.redirect('/');
    } else {
        res.redirect('/account');
    }
}


