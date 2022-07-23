const pool = require('../config/dbconfig')
var data = require('../data')

var richFunctions = require('../richardFunctions')

var userInfo = data.userInfo
////constroller functions
exports.singleDiscussion = (req, res) => {

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
    var query = "SELECT * FROM discussion ORDER BY id DESC LIMIT 6;"
    query += 'SELECT * FROM discussion WHERE id = ?;'
    query += 'SELECT rp.reply, rp.likes, rp.id AS reply_id,  us.username, us.avator, rp.user_id AS reply_by FROM replies AS rp INNER JOIN users AS us ON rp.user_id = us.id WHERE rp.post_id = ? ORDER BY rp.id DESC;'

    connection.query(query, [post_id,post_id], (err, results, fields) => {
      
      var discussion = results[1][0];
      var discussions = results[0];
      var replies = results[2];

      ////seo datas
      var title = discussion.title
      var description = discussion.description
          description.substr(0, 300)
      var slug = discussion.slug
      
      var views = discussion.views
      views = parseInt(views) + 1

      if (!err) {
        connection.query("UPDATE discussion SET views = ? WHERE id = ?",[views,post_id],(err,rows)=>{
           if(!err){
              res.render('single/discussion', {userInfo: userInfo, replies, discussions, discussion, style: "for_partials.css", title,description,slug });
           }
        })
        
      } else {
        console.log(err);
      }

      //console.log('the data: \n',rows);
    })
  })
}

exports.accountDiscussion = (req, res)=>{
  if(req.session.user){
    userInfo.isLoged = req.session.user.isLoged
    userInfo.user = req.session.user.user
 }
    pool.getConnection((err, connection) => {
        if (err) throw err; // not connected
        //console.log('Connected!');
  
        connection.query('SELECT * FROM discussion ORDER BY views DESC', (err, rows) => {
          // Once done, release connection
          //connection.release();
  
          if (!err) {
            res.render('account/discussion',{userInfo:userInfo,topics:rows,style:"account.css", title:"Discussion Dashbord Page"})
          } else {
            console.log(err);
            console.log("errors------------------------------------feed");
          }
  
        });
      });
    
}

exports.getDiscussionEdit = (req, res)=>{
    var id = req.body.id

    pool.getConnection((err, connection) => {
        if (err) throw err; // not connected
        console.log('Connected!');
  
        connection.query('SELECT * FROM discussion WHERE id = '+id, (err, rows) => {
          // Once done, release connection
          //connection.release();
          if (!err) {
            return res.json(rows);
          } else {
            console.log("get discusssion errors---------------------------------------");  
            console.log(err);
          }
  
        });
      });
    
}

exports.createDiscussion = (req, res)=>{
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
    var filename = "topic"+time.getTime() +'.'+ext;
    uploadPath = '/skillapp/uploads/images/' + filename;

      // Use mv() to place file on the server
    imageFile.mv(uploadPath, function (err) {
    if (err) return res.status(500).send(err);

    pool.getConnection((err, connection) => {
      if (err) throw err; // not connected
      console.log('Connected!');

      connection.query('INSERT INTO discussion SET title = ?, status = ? , description = ?, thumbnail = ?, created_by = ?',[title, status, description, filename, user_id], (err, rows) => {
   
        if (!err) {
          var id = rows.insertId
          var slug = richFunctions.getSlug(title,id,60)

          connection.query("UPDATE discussion SET slug = ? WHERE id = ?",[slug, id], (err,rows)=>{
              if(!err){
                res.redirect('/account/discussion');
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

exports.updateDiscussion = (req, res)=>{
    var { title, description, topic_id, status} = req.body;
    var time = new Date()
    let imageFile
    let uploadPath

    var user_id = req.session.user.user.id;

  var slug = richFunctions.getSlug(title,topic_id,60)

    if (!req.files || Object.keys(req.files).length === 0) {

        pool.getConnection((err, connection) => {
            if (err) throw err; // not connected
            console.log('Connected!');
      
            connection.query('UPDATE discussion SET title = ?, slug = ?, status = ? , description = ?, created_by = ? WHERE id = ?',[title, slug, status, description, user_id, topic_id], (err, rows) => {
              if (!err) {
                res.redirect('/account/discussion');
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
    var filename = "topic"+time.getTime() +'.'+ext;
    uploadPath = '/skillapp/uploads/images/' + filename;
    uploadPath = '/skillapp/uploads/images/' + filename;

      // Use mv() to place file on the server
    imageFile.mv(uploadPath, function (err) {
    if (err) return res.status(500).send(err);

    pool.getConnection((err, connection) => {
      if (err) throw err; // not connected
      console.log('Connected!');

      connection.query('UPDATE discussion SET title = ?, slug = ? , description = ?, thumbnail = ?, created_by = ? WHERE id = ?',[title,slug, description, filename, user_id, topic_id], (err, rows) => {
        // Once done, release connection
        //connection.release();

        if (!err) {
          res.redirect('/account/discussion');
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


exports.deleteDiscussion = (req, res)=>{

     var topic_id = req.body.id;


      pool.getConnection((err, connection) => {
          if (err) throw err; // not connected
          console.log('Connected!');
    
          connection.query('DELETE FROM discussion  WHERE id = ?',[topic_id], (err, rows) => {
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


