const pool = require('../config/dbconfig')
var data = require('../data')
var path = require('path')

var richFunctions = require('../richardFunctions')

var userInfo = data.userInfo
////constroller functions
exports.singleFeed = (req, res) => {

  if (req.session.user) {
    userInfo.isLoged = req.session.user.isLoged
    userInfo.user = req.session.user.user
  }

  var slug = req.params.slug

  var post_id = richFunctions.getIdFromSlug(slug)
  //connect to DB
  pool.getConnection((err, connection) => {
    if (err) throw err;

    //query
    var query = "SELECT us.username, fd.title, fd.thumbnail, fd.views, fd.description, fd.slug, fd.created_at FROM feeds AS fd INNER JOIN users AS us ON fd.created_by = us.id WHERE fd.status = 'active' ORDER BY views ASC LIMIT 6;"
    query += 'SELECT * FROM feeds WHERE id = ?;'
    query += 'SELECT cm.comment, cm.likes, cm.id AS comment_id,  us.username, us.avator, cm.user_id AS comment_by FROM comments AS cm INNER JOIN users AS us ON cm.user_id = us.id WHERE cm.post_id = ? AND cm.type = ? ORDER BY cm.id DESC;'

    connection.query(query, [post_id,post_id,'feed'], (err, results, fields) => {
      
      var feed = results[1][0];
      var feeds = results[0];
      var comments = results[2];

      ////seo datas
      var title = feed.title
      var description = feed.description
          description.substr(0, 200)
      var slug = feed.slug
      
      var views = feed.views
      views = parseInt(views) + 1

      if (!err) {
        connection.query("UPDATE feeds SET views = ? WHERE id = ?",[views,post_id],(err,rows)=>{
           if(!err){
              res.render('single/feed', {userInfo: userInfo, comments, feeds, feed, style: "for_partials.css", title,description,slug });
           }
        })
        
      } else {
        console.log(err);
      }

      //console.log('the data: \n',rows);
    })
  })
}

exports.accountFeed = (req, res)=>{
  if(req.session.user){
    userInfo.isLoged = req.session.user.isLoged
    userInfo.user = req.session.user.user
 }
    pool.getConnection((err, connection) => {
        if (err) throw err; // not connected
        //console.log('Connected!');
  
        connection.query('SELECT * FROM feeds ORDER BY id DESC', (err, rows) => {
          // Once done, release connection
          //connection.release();
  
          if (!err) {
            res.render('account/feed',{userInfo:userInfo,feeds:rows,style:"account.css", title:"Feeds Dashbord Page"})
          } else {
            console.log(err);
            console.log("errors------------------------------------feed");
          }
  
        });
      });
    
}

exports.getFeedEdit = (req, res)=>{
    var id = req.body.id

    pool.getConnection((err, connection) => {
        if (err) throw err; // not connected
        console.log('Connected!');
  
        connection.query('SELECT * FROM feeds WHERE id = '+id, (err, rows) => {
          // Once done, release connection
          //connection.release();
          if (!err) {
            return res.json(rows);
          } else {
            console.log("get feed errors---------------------------------------");  
            console.log(err);
          }
  
        });
      });
    
}

exports.createFeed = (req, res)=>{
    var { title, description, status} = req.body;
    var time = new Date()
    let imageFile
    let uploadPath

    var user_id = req.session.user.user.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    imageFile = req.files.thumbnail;
    var name = imageFile.name
    var nameArry = name.split(".")
    var ext = nameArry[nameArry.length - 1]
    var filename = "feed"+time.getTime() +'.'+ext;
    //console.log(imageFile)
    //uploadPath = '/skillapp/uploads/images/' + filename;
    uploadPath = path.join(__dirname, '../../uploads/images/'+filename);

      // Use mv() to place file on the server
    imageFile.mv(uploadPath, function (err) {
    if (err) return res.status(500).send(err);

    pool.getConnection((err, connection) => {
      if (err) throw err; // not connected
      console.log('Connected!');

      connection.query('INSERT INTO feeds SET title = ?, status = ? , description = ?, thumbnail = ?, created_by = ?',[title, status, description, filename, user_id], (err, rows) => {
        // Once done, release connection
        //connection.release();

        if (!err) {
          var id = rows.insertId
          var slug = richFunctions.getSlug(title,id,60)

          connection.query("UPDATE feeds SET slug = ? WHERE id = ?",[slug, id], (err,rows)=>{
              if(!err){
                res.redirect('/account/feed');
              }else{
                console.log(err);
              }
            })
        } else {
          console.log("errors---------------------------------------");  
          console.log(err);
        }

      });
    });

    // res.send('File uploaded!');
  });

    
}

exports.updateFeed = (req, res)=>{
    var { title, description, feed_id, status} = req.body;
    var time = new Date()
    let imageFile
    let uploadPath

    var user_id = req.session.user.user.id;

    var slug = richFunctions.getSlug(title,feed_id,60)

    if (!req.files || Object.keys(req.files).length === 0) {

        pool.getConnection((err, connection) => {
            if (err) throw err; // not connected
            //console.log('Connected!');
      
            connection.query('UPDATE feeds SET title = ?, slug = ?, status = ? , description = ?, created_by = ? WHERE id = ?',[title, slug, status, description, user_id, feed_id], (err, rows) => {
              // Once done, release connection
              //connection.release();
      
              if (!err) {
                res.redirect('/account/feed');
              } else {
                console.log("errors---------------------------------------");  
                console.log(err);
              }
      
            });
          });
        //return res.status(400).send('No files were uploaded.');
    }else{

    imageFile = req.files.thumbnail;
    var name = imageFile.name
    var nameArry = name.split(".")
    var ext = nameArry[nameArry.length - 1]
    var filename = "feed"+time.getTime() +'.'+ext;
    //console.log(imageFile)
    uploadPath = path.join(__dirname, '../../uploads/images/'+filename);

      // Use mv() to place file on the server
    imageFile.mv(uploadPath, function (err) {
    if (err) return res.status(500).send(err);

    pool.getConnection((err, connection) => {
      if (err) throw err; // not connected
      console.log('Connected!');

      connection.query('UPDATE feeds SET title = ?, slug = ?, status = ? , description = ?, thumbnail = ?, created_by = ? WHERE id = ?',[title, slug , status, description, filename, user_id, feed_id], (err, rows) => {
        // Once done, release connection
        //connection.release();

        if (!err) {
          res.redirect('/account/feed');
        } else {
          console.log("errors---------------------------------------");  
          console.log(err);
        }

      });
    });

    // res.send('File uploaded!');
  });
}

    
}


exports.deleteFeed = (req, res)=>{

     var feed_id = req.body.id;


      pool.getConnection((err, connection) => {
          if (err) throw err; // not connected
          console.log('Connected!');
    
          connection.query('DELETE FROM feeds  WHERE id = ?',[feed_id], (err, rows) => {
            // Once done, release connection
            //connection.release();
    
            if (!err) {
                return res.send('success');

            } else {
              console.log("errors---------------------------------------");  
              console.log(err);
              return res.send('error');
            }
    
          });
        });
      //return res.status(400).send('No files were uploaded.');
}


