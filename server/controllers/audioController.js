const pool = require('../config/dbconfig')
var data = require('../data')

var richFunctions = require('../richardFunctions')

var userInfo = data.userInfo

///user pages functions
exports.singleAudio = (req, res) => {

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
    var query = "SELECT vc.id, us.username, us.avator, us.id AS user_id, vc.title, vc.slug, vc.thumbnail, vc.price FROM audio_courses AS vc INNER JOIN users AS us ON vc.created_by = us.id  WHERE vc.status = 'active' ORDER BY vc.views ASC LIMIT 4;"
    query += 'SELECT * FROM audio_lists WHERE course_id = ? ORDER BY order_number ASC;'
    query += 'SELECT * FROM audio_courses WHERE id = ?;'
    query += 'SELECT cm.comment, cm.likes, cm.id AS comment_id,  us.username, us.avator, cm.user_id AS comment_by FROM comments AS cm INNER JOIN users AS us ON cm.user_id = us.id WHERE cm.post_id = ? AND cm.type = ? ORDER BY cm.id DESC;'

    connection.query(query, [post_id,post_id,post_id,'audio'], (err, results, fields) => {
      
      var course = results[2][0];
      var audios = results[0];
      var audio_list = results[1];
      var comments = results[3];

      ////seo datas
      var title = course.title
      var description = course.description
          description.substr(0, 200)
      var slug = course.slug
      
      var views = course.views
      views = parseInt(views) + 1

      if (!err) {
        connection.query("UPDATE audio_courses SET views = ? WHERE id = ?",[views,post_id],(err,rows)=>{
           if(!err){
              res.render('single/audio', {userInfo: userInfo, comments, audios, audio_list, course, style: "for_partials.css", title,description,slug });
           }
        })
        
      } else {
        console.log(err);
      }

      //console.log('the data: \n',rows);
    })
  })
}

////constroller functions
exports.accountAudio = (req, res)=>{
  
  if(req.session.user){
    userInfo.isLoged = req.session.user.isLoged
    userInfo.user = req.session.user.user
 }
    pool.getConnection((err, connection) => {
        if (err) throw err; // not connected
        //console.log('Connected!');
  
        connection.query('SELECT * FROM audio_courses ORDER BY id DESC', (err, rows) => {
          // Once done, release connection
          //connection.release();
  
          if (!err) {
            res.render('account/audio',{userInfo:userInfo,audios:rows,style:"account.css", title:"Audio Dashbord Page"})
          } else {
            console.log(err);
            console.log("errors------------------------------------audio");
          }
  
        });
      });
    
}

exports.getAudioEdit = (req, res)=>{
    var id = req.body.id

    pool.getConnection((err, connection) => {
        if (err) throw err; // not connected
        console.log('Connected!');
  
        connection.query('SELECT * FROM audio_courses WHERE id = '+id, (err, rows) => {
          // Once done, release connection
          //connection.release();
          if (!err) {
            return res.json(rows);
          } else {
            console.log("get audio errors---------------------------------------");  
            console.log(err);
          }
  
        });
      });
    
}

exports.createAudio = (req, res)=>{
    var { title, description, price, status} = req.body;
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
    var filename = "audio"+time.getTime() +'.'+ext;
    //console.log(imageFile)
    //uploadPath = '/skillapp/uploads/images/' + filename;
    uploadPath = path.join(__dirname, '../../uploads/images/'+filename);

      // Use mv() to place file on the server
    imageFile.mv(uploadPath, function (err) {
    if (err) return res.status(500).send(err);

    pool.getConnection((err, connection) => {
      if (err) throw err; // not connected
      console.log('Connected!');

      connection.query('INSERT INTO audio_courses SET title = ?, status = ? , description = ? , price = ?, thumbnail = ?, created_by = ?',[title, status, description, price, filename, user_id], (err, rows) => {
        // Once done, release connection
        //connection.release();

        if (!err) {
          var id = rows.insertId
          var slug = richFunctions.getSlug(title,id,60)

          connection.query("UPDATE audio_courses SET slug = ? WHERE id = ?",[slug, id], (err,rows)=>{
              if(!err){
                res.redirect('/account/audio');
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

exports.updateAudio = (req, res)=>{
    var { title, description, price, post_id, status} = req.body;
    var time = new Date()
    let imageFile
    let uploadPath
    var user_id = req.session.user.user.id;

    var slug = richFunctions.getSlug(title,post_id,60)

    if (!req.files || Object.keys(req.files).length === 0) {

        pool.getConnection((err, connection) => {
            if (err) throw err; // not connected
            console.log('Connected!');
      
            connection.query('UPDATE audio_courses SET title = ? , status = ? , description = ? , price = ?, created_by = ?, slug = ? WHERE id = ?',[title, status, description, price, user_id,slug, post_id], (err, rows) => {
              // Once done, release connection
              //connection.release();
      
              if (!err) {
                res.redirect('/account/audio');
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
    var filename = "audio"+time.getTime() +'.'+ext;
    //console.log(imageFile)
    //uploadPath = '/skillapp/uploads/images/' + filename;
    uploadPath = path.join(__dirname, '../../uploads/images/'+filename);

      // Use mv() to place file on the server
    imageFile.mv(uploadPath, function (err) {
    if (err) return res.status(500).send(err);

    pool.getConnection((err, connection) => {
      if (err) throw err; // not connected
      console.log('Connected!');

      connection.query('UPDATE audio_courses SET title = ? , description = ? , price = ?, thumbnail = ?, created_by = ?, slug = ? WHERE id = ?',[title, description, price, filename, user_id,slug, post_id], (err, rows) => {
        // Once done, release connection
        //connection.release();

        if (!err) {
          res.redirect('/account/audio');
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

////constroller functions
exports.accountAudioList = (req, res)=>{
  
  if(req.session.user){
    userInfo.isLoged = req.session.user.isLoged
    userInfo.user = req.session.user.user
 }
  var audio_id = req.params.id 

  pool.getConnection((err, connection) => {
      if (err) throw err; // not connected
      //console.log('Connected!');

      connection.query('SELECT * FROM audio_courses WHERE id = ?',[audio_id], (err, audio) => {
        console.log(audio_id)
        //connection.release();

        if (!err) {
          connection.query('SELECT * FROM audio_lists WHERE course_id = ? ORDER BY order_number ASC',[audio_id], (err, rows) => {
            if (!err) {
              res.render('account/audio_list',{userInfo:userInfo,audio:audio[0],vlist:rows,style:"account.css", title:"Video Dashbord Page"})
            }else {
              console.log(err);
              console.log("errors------------------------------------videpo");
            }

          })
          
        } else {
          console.log(err);
          console.log("errors------------------------------------videpo");
        }

      });
    });
  
}

exports.createAudiolist = (req, res)=>{
  audio_id = req.params.id
  var { sub_title, order_number, label} = req.body;
  var time = new Date()
  let audioFile
  let uploadPath

  if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
  }

  audioFile = req.files.videofile;
  var name = audioFile.name
  var nameArry = name.split(".")
  var ext = nameArry[nameArry.length - 1]
  var filename = "audios"+time.getTime() +'.'+ext;
  
  //uploadPath = '/skillapp/uploads/audios/' + filename;
  uploadPath = path.join(__dirname, '../../uploads/audios/'+filename);

    // Use mv() to place file on the server
  audioFile.mv(uploadPath, function (err) {
  if (err) return res.status(500).send(err);

  pool.getConnection((err, connection) => {
    if (err) throw err; // not connected
    console.log('Connected!');

    connection.query('INSERT INTO audio_lists SET sub_title = ? , order_number = ? , label = ?, audio_url = ?, course_id = ?',[sub_title, order_number, label, filename, audio_id], (err, rows) => {
      // Once done, release connection
      //connection.release();

      if (!err) {
        res.redirect('/account/audio-list/'+audio_id);
      } else {
        console.log("errors---------------------------------------");  
        console.log(err);
      }

    });
  });

  // res.send('File uploaded!');
});

  
}

exports.getAudioListEdit = (req, res)=>{
  var id = req.body.id

  pool.getConnection((err, connection) => {
      if (err) throw err; // not connected
      console.log('Connected!');

      connection.query('SELECT * FROM audio_lists WHERE id = '+id, (err, rows) => {
        // Once done, release connection
        //connection.release();
        if (!err) {
          return res.json(rows);
        } else {
          console.log("get audio errors---------------------------------------");  
          console.log(err);
        }

      });
    });
  
}

exports.updateAudioList = (req, res)=>{
  var { sub_title, order_number, label, course_id, audio_id} = req.body;


      pool.getConnection((err, connection) => {
          if (err) throw err; // not connected
          console.log('Connected!');
    
          connection.query('UPDATE audio_lists SET sub_title = ?, order_number = ?, label = ? WHERE id = ?',[sub_title, order_number, label, audio_id], (err, rows) => {
            // Once done, release connection
            //connection.release();
    
            if (!err) {
              res.redirect('/account/video-list/'+course_id);
            } else {
              console.log("errors---------------------------------------");  
              console.log(err);
            }
    
          });
        });
      //return res.status(400).send('No files were uploaded.');
}

exports.deleteAudio = (req, res)=>{

     var audio_id = req.body.id;


      pool.getConnection((err, connection) => {
          if (err) throw err; // not connected
          console.log('Connected!');
    
          connection.query('DELETE FROM audio_courses  WHERE id = ?',[audio_id], (err, rows) => {
            // Once done, release connection
            //connection.release();
    
            if (!err) {
              connection.query('DELETE FROM audio_lists  WHERE course_id = ?',[audio_id], (err, rows) => {
              
                if (!err) {
                return res.send('success');
                }else{
                  return res.send('error');
                }
              })

            } else {
              console.log("errors---------------------------------------");  
              console.log(err);
              return res.send('error');
            }
    
          });
        });
      //return res.status(400).send('No files were uploaded.');
}

exports.deleteAudioList = (req, res)=>{

  var audio_id = req.body.id;


   pool.getConnection((err, connection) => {
       if (err) throw err; // not connected
       console.log('Connected!');
 
       connection.query('DELETE FROM audio_lists  WHERE id = ?',[audio_id], (err, rows) => {
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
