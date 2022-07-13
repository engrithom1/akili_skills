const pool = require('../config/dbconfig')
var data = require('../data')

var userInfo = data.userInfo
////constroller functions
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

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    imageFile = req.files.thumbnail;
    var filename = 'feed'+time.getTime()+imageFile.name;
    //console.log(imageFile)
    uploadPath = '/skillapp/uploads/images/' + filename;

      // Use mv() to place file on the server
    imageFile.mv(uploadPath, function (err) {
    if (err) return res.status(500).send(err);

    pool.getConnection((err, connection) => {
      if (err) throw err; // not connected
      console.log('Connected!');

      connection.query('INSERT INTO feeds SET title = ?, status = ? , description = ?, thumbnail = ?, created_by = ?',[title, status, description, filename, 1], (err, rows) => {
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

exports.updateFeed = (req, res)=>{
    var { title, description, feed_id, status} = req.body;
    var time = new Date()
    let imageFile
    let uploadPath

    if (!req.files || Object.keys(req.files).length === 0) {

        pool.getConnection((err, connection) => {
            if (err) throw err; // not connected
            console.log('Connected!');
      
            connection.query('UPDATE feeds SET title = ? , status = ? , description = ?, created_by = ? WHERE id = ?',[title, status, description, 1, feed_id], (err, rows) => {
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
    var filename = 'feed'+time.getTime()+imageFile.name;
    //console.log(imageFile)
    uploadPath = '/skillapp/uploads/images/' + filename;

      // Use mv() to place file on the server
    imageFile.mv(uploadPath, function (err) {
    if (err) return res.status(500).send(err);

    pool.getConnection((err, connection) => {
      if (err) throw err; // not connected
      console.log('Connected!');

      connection.query('UPDATE feeds SET title = ? , description = ?, thumbnail = ?, created_by = ? WHERE id = ?',[title, description, filename, 1, feed_id], (err, rows) => {
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


