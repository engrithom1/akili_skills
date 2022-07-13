const pool = require('../config/dbconfig')
var data = require('../data')

var userInfo = data.userInfo
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

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    imageFile = req.files.thumbnail;
    var filename = 'audio'+time.getTime()+imageFile.name;
    //console.log(imageFile)
    uploadPath = '/skillapp/uploads/images/' + filename;

      // Use mv() to place file on the server
    imageFile.mv(uploadPath, function (err) {
    if (err) return res.status(500).send(err);

    pool.getConnection((err, connection) => {
      if (err) throw err; // not connected
      console.log('Connected!');

      connection.query('INSERT INTO audio_courses SET title = ?, status = ? , description = ? , price = ?, thumbnail = ?, created_by = ?',[title, status, description, price, filename, 1], (err, rows) => {
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

exports.updateAudio = (req, res)=>{
    var { title, description, price, post_id, status} = req.body;
    var time = new Date()
    let imageFile
    let uploadPath

    if (!req.files || Object.keys(req.files).length === 0) {

        pool.getConnection((err, connection) => {
            if (err) throw err; // not connected
            console.log('Connected!');
      
            connection.query('UPDATE audio_courses SET title = ? , status = ? , description = ? , price = ?, created_by = ? WHERE id = ?',[title, status, description, price, 1, post_id], (err, rows) => {
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
    var filename = 'audio'+time.getTime()+imageFile.name;
    //console.log(imageFile)
    uploadPath = '/skillapp/uploads/images/' + filename;

      // Use mv() to place file on the server
    imageFile.mv(uploadPath, function (err) {
    if (err) return res.status(500).send(err);

    pool.getConnection((err, connection) => {
      if (err) throw err; // not connected
      console.log('Connected!');

      connection.query('UPDATE audio_courses SET title = ? , description = ? , price = ?, thumbnail = ?, created_by = ? WHERE id = ?',[title, description, price, filename, 1, post_id], (err, rows) => {
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
  let videoFile
  let uploadPath

  if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
  }

  videoFile = req.files.videofile;
  var filename = 'audio'+time.getTime()+videoFile.name;
  console.log(videoFile)
  uploadPath = '/skillapp/uploads/audios/' + filename;

    // Use mv() to place file on the server
  videoFile.mv(uploadPath, function (err) {
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
