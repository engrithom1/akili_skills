const pool = require('../config/dbconfig')
var data = require('../data')

var userInfo = data.userInfo
//home page
exports.home = (req, res) => {
    console.log(req.session.user)
    if(req.session.user){
       userInfo.isLoged = req.session.user.isLoged
       userInfo.user = req.session.user.user
    }
     
    //connect to DB
    pool.getConnection((err, connection) =>{
        if(err) throw err;
        //console.log('Connection as ID '+connection.threadId)

        //query
        connection.query('SELECT * FROM users', (err, rows) => {
            connection.release();
            var projectz = data.projects;
            var books = projectz.slice(0,6);
            var audios = projectz.slice(0,3);
            var feeds = projectz.slice(2,6);
            var videos = projectz.slice(3,6);
            if(!err){
                console.log(userInfo)
                res.render('home',{userInfo:userInfo, style:"for_partials.css",books,feeds, videos, audios, title:"akili skills app"});
            }else{
                console.log(err);
            }
            
            //console.log('the data: \n',rows);
        })
    })

}
exports.feedPage = (req, res) => {
    
    //connect to DB
    pool.getConnection((err, connection) =>{
        if(err) throw err;
        //console.log('Connection as ID '+connection.threadId)

        //query
        connection.query('SELECT * FROM users', (err, rows) => {
            connection.release();
            var feeds = data.projects;
            if(!err){
                
                res.render('feeds',{style:"for_partials.css", feeds, title:"Audio Courses for you"});
            }else{
                console.log(err);
            }
            
            //console.log('the data: \n',rows);
        })
    })

}

exports.qnaPage = (req, res) => {
    
    //connect to DB
    pool.getConnection((err, connection) =>{
        if(err) throw err;
        //console.log('Connection as ID '+connection.threadId)

        //query
        connection.query('SELECT * FROM users', (err, rows) => {
            connection.release();
            var qnas = data.projects;
            if(!err){
                
                res.render('qnas',{style:"for_partials.css", qnas, title:"Audio Courses for you"});
            }else{
                console.log(err);
            }
            
            //console.log('the data: \n',rows);
        })
    })

}

exports.discussionPage = (req, res) => {
    
    //connect to DB
    pool.getConnection((err, connection) =>{
        if(err) throw err;
        //console.log('Connection as ID '+connection.threadId)

        //query
        connection.query('SELECT * FROM users', (err, rows) => {
            connection.release();
            var discussions = data.projects;
            if(!err){
                
                res.render('discussions',{style:"for_partials.css", discussions, title:"Audio Courses for you"});
            }else{
                console.log(err);
            }
            
            //console.log('the data: \n',rows);
        })
    })

}

//audio page
exports.audioPage = (req, res) => {
    
    //connect to DB
    pool.getConnection((err, connection) =>{
        if(err) throw err;
        //console.log('Connection as ID '+connection.threadId)

        //query
        connection.query('SELECT * FROM users', (err, rows) => {
            connection.release();
            var audios = data.projects;
            if(!err){
                
                res.render('audios',{style:"for_partials.css", audios, title:"Audio Courses for you"});
            }else{
                console.log(err);
            }
            
            //console.log('the data: \n',rows);
        })
    })

}

//video page
exports.videoPage = (req, res) => {

    //connect to DB
    pool.getConnection((err, connection) =>{
        if(err) throw err;
        //console.log('Connection as ID '+connection.threadId)

        //query
        connection.query('SELECT * FROM users', (err, rows) => {
            connection.release();
            var videos = data.projects;
            if(!err){
                
                res.render('videos',{style:"for_partials.css", videos, title:"Video Courses for you"});
            }else{
                console.log(err);
            }
            
            //console.log('the data: \n',rows);
        })
    })

}

//video page
exports.bookPage = (req, res) => {

    //connect to DB
    pool.getConnection((err, connection) =>{
        if(err) throw err;
        //console.log('Connection as ID '+connection.threadId)

        //query
        connection.query('SELECT * FROM users', (err, rows) => {
            connection.release();
            var books = data.projects;
            if(!err){
                
                res.render('books',{style:"for_partials.css", books, title:"Books available for your"});
            }else{
                console.log(err);
            }
            
            //console.log('the data: \n',rows);
        })
    })

}

exports.accountPage = (req, res) =>{
    if(req.session.user){
        userInfo.isLoged = req.session.user.isLoged
        userInfo.user = req.session.user.user
     }
    pool.getConnection((err, connection) => {
        if (err) throw err; // not connected
        //console.log('Connected!');
  
        connection.query('SELECT * FROM users WHERE id = ?',[7], (err, rows) => {
          // Once done, release connection
          //connection.release();
  
          if (!err) {
            res.render('account',{userInfo:userInfo,style:"account.css", title:"Account page"});
          } else {
            console.log(err);
            console.log("errors------------------------------------feed");
          }
  
        });
      });
    
}