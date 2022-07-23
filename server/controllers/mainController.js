const pool = require('../config/dbconfig')
var data = require('../data')

const axios = require('axios')

var userInfo = data.userInfo
//home page
exports.home = (req, res) => {
         
    if(req.session.user){
       userInfo.isLoged = req.session.user.isLoged
       userInfo.user = req.session.user.user
    }
    var query = "SELECT vc.id, us.username, us.avator, us.id AS user_id, vc.title, vc.slug, vc.thumbnail, vc.price FROM video_courses AS vc INNER JOIN users AS us ON vc.created_by = us.id  WHERE vc.status = 'active' ORDER BY vc.views DESC LIMIT 3;"
        query += "SELECT ac.id, us.username, us.avator, us.id AS user_id, ac.title, ac.slug, ac.thumbnail, ac.price FROM audio_courses AS ac INNER JOIN users AS us ON ac.created_by = us.id  WHERE ac.status = 'active' ORDER BY ac.views DESC LIMIT 3;"
        query += "SELECT * FROM books WHERE status = 'active' ORDER BY views DESC LIMIT 6;" 
        query += "SELECT us.username, fd.title, fd.thumbnail, fd.views, fd.description, fd.slug, fd.created_at FROM feeds AS fd INNER JOIN users AS us ON fd.created_by = us.id WHERE fd.status = 'active' ORDER BY views DESC LIMIT 6;"  
    //connect to DB
    pool.getConnection((err, connection) =>{
        if(err){
            console.log(err)
        }
        // select videos
        connection.query(query, (err, results, fields) => {
            if(!err){
               var videos = results[0]
               var audios = results[1]
               var books = results[2]
               var feeds = results[3];

               var projectz = data.projects;
               
               
               res.render('home',{userInfo:userInfo, style:"for_partials.css",books,feeds, videos, audios, title:"akili skills app"});
               
            }else{ console.log(err)}
        })

       
    })

    

}

exports.feedPage = (req, res) => {

    if(req.session.user){
        userInfo.isLoged = req.session.user.isLoged
        userInfo.user = req.session.user.user
     }
    //connect to DB
    pool.getConnection((err, connection) =>{
        if(err) throw err;
        //console.log('Connection as ID '+connection.threadId)

        //query
        connection.query("SELECT us.username, fd.title, fd.thumbnail, fd.views, fd.description, fd.slug, fd.created_at FROM feeds AS fd INNER JOIN users AS us ON fd.created_by = us.id WHERE fd.status = 'active' ORDER BY views DESC;", (err, feeds) => {
            
            if(!err){
                
                res.render('feeds',{userInfo:userInfo,style:"for_partials.css", feeds, title:"Audio Courses for you"});
            }else{
                console.log(err);
            }
            
            //console.log('the data: \n',rows);
        })
    })

}

exports.qnaPage = (req, res) => {
       
    if (req.session.user) {
        userInfo.isLoged = req.session.user.isLoged
        userInfo.user = req.session.user.user
      }
    //connect to DB
    pool.getConnection((err, connection) =>{
        if(err) throw err;
        //console.log('Connection as ID '+connection.threadId)

        //query
        connection.query("SELECT us.username, us.avator, fd.question, fd.slug, fd.views, fd.answer, fd.created_at FROM question_answers AS fd INNER JOIN users AS us ON fd.ask_by = us.id WHERE fd.status = 'active' ORDER BY views ASC LIMIT 6;", (err, qnas) => {
            
            if(!err){
                
                res.render('qnas',{userInfo:userInfo, style:"for_partials.css", qnas, title:"experts wisdom, Questions and answers from akiliforum.com"});
            }else{
                console.log(err);
            }
            
            //console.log('the data: \n',rows);
        })
    })

}

exports.discussionPage = (req, res) => {
    
    if (req.session.user) {
        userInfo.isLoged = req.session.user.isLoged
        userInfo.user = req.session.user.user
      }
    //connect to DB
    pool.getConnection((err, connection) =>{
        if(err) throw err;

        connection.query("SELECT * FROM discussion WHERE status = 'active' ORDER BY views DESC", (err, discussions) => {
            connection.release();
            
            if(!err){
                
                res.render('discussions',{userInfo:userInfo, style:"for_partials.css", discussions, title:"Audio Courses for you"});
            }else{
                console.log(err);
            }
            
            //console.log('the data: \n',rows);
        })
    })

}

//audio page
exports.audioPage = (req, res) => {
     
    
    if (req.session.user) {
        userInfo.isLoged = req.session.user.isLoged
        userInfo.user = req.session.user.user
      }
    //connect to DB
    pool.getConnection((err, connection) =>{
        if(err) throw err;
        //console.log('Connection as ID '+connection.threadId)
        
        //query
        connection.query("SELECT ac.id, us.username, us.avator, us.id AS user_id, ac.title, ac.slug, ac.thumbnail, ac.price FROM audio_courses AS ac INNER JOIN users AS us ON ac.created_by = us.id  WHERE ac.status = 'active' ORDER BY ac.views DESC;", (err, audios) => {
           
            if(!err){
                
                res.render('audios',{userInfo:userInfo, style:"for_partials.css", audios, title:"Audio Courses for you"});
            }else{
                console.log(err);
            }
            
            //console.log('the data: \n',rows);
        })
    })

}

//video page
exports.videoPage = (req, res) => {
     
    
    if (req.session.user) {
        userInfo.isLoged = req.session.user.isLoged
        userInfo.user = req.session.user.user
      }
    //connect to DB
    pool.getConnection((err, connection) =>{
        if(err) throw err;
        //console.log('Connection as ID '+connection.threadId)

        //query
        connection.query("SELECT vc.id, us.username, us.avator, us.id AS user_id, vc.title, vc.slug, vc.thumbnail, vc.price FROM video_courses AS vc INNER JOIN users AS us ON vc.created_by = us.id  WHERE vc.status = 'active' ORDER BY vc.views DESC;", (err, videos) => {
           
            if(!err){
                
                res.render('videos',{userInfo:userInfo, style:"for_partials.css", videos, title:"Video Courses for you"});
            }else{
                console.log(err);
            }
            
            //console.log('the data: \n',rows);
        })
    })

}

//video page
exports.bookPage = (req, res) => {
         
    if (req.session.user) {
        userInfo.isLoged = req.session.user.isLoged
        userInfo.user = req.session.user.user
      }
    //connect to DB
    pool.getConnection((err, connection) =>{
        if(err) throw err;
        //console.log('Connection as ID '+connection.threadId)

        //query
        connection.query("SELECT * FROM books WHERE status = 'active' ORDER BY views DESC", (err, books) => {
            
            if(!err){
                
                res.render('books',{userInfo:userInfo,style:"for_partials.css", books, title:"Books available for your"});
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

