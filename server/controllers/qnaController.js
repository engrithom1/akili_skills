const pool = require('../config/dbconfig')
var data = require('../data')

var richFunctions = require('../richardFunctions')

var userInfo = data.userInfo
////constroller functions
exports.singleQna = (req, res) => {

  if (req.session.user && req.cookies.user_sid) {
    userInfo.isLoged = req.session.user.isLoged
    userInfo.user = req.session.user.user
  }

  var slug = req.params.slug

  var post_id = richFunctions.getIdFromSlug(slug)
  //connect to DB
  pool.getConnection((err, connection) => {
    if (err) throw err;

    //query
    var query = "SELECT us.username, us.avator, fd.question, fd.slug, fd.views, fd.answer, fd.created_at FROM question_answers AS fd INNER JOIN users AS us ON fd.ask_by = us.id WHERE fd.status = 'active' ORDER BY views ASC LIMIT 6;"
    query += "SELECT us.username, us.avator, fd.question, fd.slug, fd.views, fd.answer, fd.created_at FROM question_answers AS fd INNER JOIN users AS us ON fd.ask_by = us.id WHERE fd.id = ?;"
    

    connection.query(query, [post_id], (err, results, fields) => {
      
      var qna = results[1][0];
      var qnas = results[0];

      console.log(qna)

      ////seo datas
      var title = qna.question
      var description = qna.answer
          description.substr(0, 200)
      var slug = qna.slug
      
      var views = qna.views
      views = parseInt(views) + 1

      if (!err) {
        connection.query("UPDATE question_answers SET views = ? WHERE id = ?",[views,post_id],(err,rows)=>{
           if(!err){
              res.render('single/qna', {userInfo: userInfo, qnas, qna, style: "for_partials.css", title,description,slug });
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

exports.createQna = (req, res)=>{

    var { question } = req.body;
    
    var user_id = req.session.user.user.id;


    pool.getConnection((err, connection) => {
      if (err) throw err; // not connected
      console.log('Connected!');

      connection.query('INSERT INTO question_answers SET question = ?, ask_by = ?',[question, user_id], (err, rows) => {
        // Once done, release connection
        //connection.release();

        if (!err) {
          var id = rows.insertId
          var slug = richFunctions.getSlug(question,id,60)

          connection.query("UPDATE question_answers SET slug = ? WHERE id = ?",[slug, id], (err,rows)=>{
              if(!err){
                return res.send('success')
              }else{
                console.log(err);
                return res.send('error')
              }
            })
        } else {
          console.log("errors---------------------------------------");  
          console.log(err);
        }

      });
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
    uploadPath = '/skillapp/uploads/images/' + filename;

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


