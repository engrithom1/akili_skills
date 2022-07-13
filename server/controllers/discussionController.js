const pool = require('../config/dbconfig')
var data = require('../data')

var userInfo = data.userInfo
////constroller functions
exports.accountDiscussion = (req, res)=>{
  if(req.session.user){
    userInfo.isLoged = req.session.user.isLoged
    userInfo.user = req.session.user.user
 }
    pool.getConnection((err, connection) => {
        if (err) throw err; // not connected
        //console.log('Connected!');
  
        connection.query('SELECT * FROM discussion ORDER BY id DESC', (err, rows) => {
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

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    imageFile = req.files.thumbnail;
    var filename = 'topics'+time.getTime()+imageFile.name;
    //console.log(imageFile)
    uploadPath = '/skillapp/uploads/images/' + filename;

      // Use mv() to place file on the server
    imageFile.mv(uploadPath, function (err) {
    if (err) return res.status(500).send(err);

    pool.getConnection((err, connection) => {
      if (err) throw err; // not connected
      console.log('Connected!');

      connection.query('INSERT INTO discussion SET title = ?, status = ? , description = ?, thumbnail = ?, created_by = ?',[title, status, description, filename, 1], (err, rows) => {
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

exports.updateDiscussion = (req, res)=>{
    var { title, description, topic_id, status} = req.body;
    var time = new Date()
    let imageFile
    let uploadPath

    if (!req.files || Object.keys(req.files).length === 0) {

        pool.getConnection((err, connection) => {
            if (err) throw err; // not connected
            console.log('Connected!');
      
            connection.query('UPDATE discussion SET title = ? , status = ? , description = ?, created_by = ? WHERE id = ?',[title, status, description, 1, topic_id], (err, rows) => {
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
        //return res.status(400).send('No files were uploaded.');
    }else{

    imageFile = req.files.thumbnail;
    var filename = 'topic'+time.getTime()+imageFile.name;
    //console.log(imageFile)
    uploadPath = '/skillapp/uploads/images/' + filename;

      // Use mv() to place file on the server
    imageFile.mv(uploadPath, function (err) {
    if (err) return res.status(500).send(err);

    pool.getConnection((err, connection) => {
      if (err) throw err; // not connected
      console.log('Connected!');

      connection.query('UPDATE discussion SET title = ? , description = ?, thumbnail = ?, created_by = ? WHERE id = ?',[title, description, filename, 1, topic_id], (err, rows) => {
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


