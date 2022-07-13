const pool = require('../config/dbconfig')
var data = require('../data')

var userInfo = data.userInfo
///user pages functions
exports.singleVideo = (req, res)=>{

   //connect to DB
   pool.getConnection((err, connection) =>{
    if(err) throw err;
    //console.log('Connection as ID '+connection.threadId)

    //query
    connection.query('SELECT * FROM users', (err, rows) => {
        connection.release();
        var projectz = data.projects;
        var videos = projectz.slice(0,4);
        var course = data.course;
        
        if(!err){
            //console.log(userInfo)
            res.render('single/video',{videos,course , style:"for_partials.css", title:course.title});
        }else{
            console.log(err);
        }
        
        //console.log('the data: \n',rows);
    })
  })
}
////admin panel constroller functions
exports.accountVideo = (req, res)=>{

  if(req.session.user){
    userInfo.isLoged = req.session.user.isLoged
    userInfo.user = req.session.user.user
 }
    pool.getConnection((err, connection) => {
        if (err) throw err; // not connected
        //console.log('Connected!');
  
        connection.query('SELECT * FROM video_courses ORDER BY id DESC', (err, rows) => {
          // Once done, release connection
          //connection.release();
  
          if (!err) {
            res.render('account/video',{userInfo:userInfo,videos:rows,style:"account.css", title:"Video Dashbord Page"})
          } else {
            console.log(err);
            console.log("errors------------------------------------videpo");
          }
  
        });
      });
    
}

exports.getVideoEdit = (req, res)=>{
    var id = req.body.id

    pool.getConnection((err, connection) => {
        if (err) throw err; // not connected
        console.log('Connected!');
  
        connection.query('SELECT * FROM video_courses WHERE id = '+id, (err, rows) => {
          // Once done, release connection
          //connection.release();
          if (!err) {
            return res.json(rows);
          } else {
            console.log("get video errors---------------------------------------");  
            console.log(err);
          }
  
        });
      });
    
}

exports.createVideo = (req, res)=>{
    var { title, description, price, status} = req.body;
    var time = new Date()
    let imageFile
    let uploadPath

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    imageFile = req.files.thumbnail;
    var filename = time.getTime()+imageFile.name;
    //console.log(imageFile)
    uploadPath = '/skillapp/uploads/images/' + filename;

      // Use mv() to place file on the server
    imageFile.mv(uploadPath, function (err) {
    if (err) return res.status(500).send(err);

    pool.getConnection((err, connection) => {
      if (err) throw err; // not connected
      console.log('Connected!');

      connection.query('INSERT INTO video_courses SET title = ?, status = ? , description = ? , price = ?, thumbnail = ?, created_by = ?',[title, status, description, price, filename, 1], (err, rows) => {
        // Once done, release connection
        //connection.release();

        if (!err) {
          res.redirect('/account/video');
        } else {
          console.log("errors---------------------------------------");  
          console.log(err);
        }

      });
    });

    // res.send('File uploaded!');
  });

    
}

exports.updateVideo = (req, res)=>{
    var { title, description, price, post_id, status} = req.body;
    var time = new Date()
    let imageFile
    let uploadPath

    if (!req.files || Object.keys(req.files).length === 0) {

        pool.getConnection((err, connection) => {
            if (err) throw err; // not connected
            console.log('Connected!');
      
            connection.query('UPDATE video_courses SET title = ?, status = ? , description = ? , price = ?, created_by = ? WHERE id = ?',[title, status, description, price, 1, post_id], (err, rows) => {
              // Once done, release connection
              //connection.release();
      
              if (!err) {
                res.redirect('/account/video');
              } else {
                console.log("errors---------------------------------------");  
                console.log(err);
              }
      
            });
          });
        //return res.status(400).send('No files were uploaded.');
    }else{

    imageFile = req.files.thumbnail;
    var filename = time.getTime()+imageFile.name;
    //console.log(imageFile)
    uploadPath = '/skillapp/uploads/images/' + filename;

      // Use mv() to place file on the server
    imageFile.mv(uploadPath, function (err) {
    if (err) return res.status(500).send(err);

    pool.getConnection((err, connection) => {
      if (err) throw err; // not connected
      console.log('Connected!');

      connection.query('UPDATE video_courses SET title = ? , description = ? , price = ?, thumbnail = ?, created_by = ? WHERE id = ?',[title, description, price, filename, 1, post_id], (err, rows) => {
        // Once done, release connection
        //connection.release();

        if (!err) {
          res.redirect('/account/video');
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
exports.accountVideoList = (req, res)=>{
  if(req.session.user){
    userInfo.isLoged = req.session.user.isLoged
    userInfo.user = req.session.user.user
 }
  var video_id = req.params.id 

  pool.getConnection((err, connection) => {
      if (err) throw err; // not connected
      //console.log('Connected!');

      connection.query('SELECT * FROM video_courses WHERE id = ?',[video_id], (err, video) => {
        console.log(video_id)
        //connection.release();

        if (!err) {
          connection.query('SELECT * FROM video_lists WHERE course_id = ? ORDER BY order_number ASC',[video_id], (err, rows) => {
            if (!err) {
              res.render('account/video_list',{userInfo:userInfo,video:video[0],vlist:rows,style:"account.css", title:"Video Dashbord Page"})
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

exports.createVideolist = (req, res)=>{
  video_id = req.params.id
  var { sub_title, order_number, label} = req.body;
  var time = new Date()
  let videoFile
  let uploadPath

  if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
  }

  videoFile = req.files.videofile;
  var filename = time.getTime()+videoFile.name;
  console.log(videoFile)
  uploadPath = '/skillapp/uploads/videos/' + filename;

    // Use mv() to place file on the server
  videoFile.mv(uploadPath, function (err) {
  if (err) return res.status(500).send(err);

  pool.getConnection((err, connection) => {
    if (err) throw err; // not connected
    console.log('Connected!');

    connection.query('INSERT INTO video_lists SET sub_title = ? , order_number = ? , label = ?, video_url = ?, course_id = ?',[sub_title, order_number, label, filename, video_id], (err, rows) => {
      // Once done, release connection
      //connection.release();

      if (!err) {
        res.redirect('/account/video-list/'+video_id);
      } else {
        console.log("errors---------------------------------------");  
        console.log(err);
      }

    });
  });

  // res.send('File uploaded!');
});

  
}

exports.getVideoListEdit = (req, res)=>{
  var id = req.body.id

  pool.getConnection((err, connection) => {
      if (err) throw err; // not connected
      console.log('Connected!');

      connection.query('SELECT * FROM video_lists WHERE id = '+id, (err, rows) => {
        // Once done, release connection
        //connection.release();
        if (!err) {
          return res.json(rows);
        } else {
          console.log("get video errors---------------------------------------");  
          console.log(err);
        }

      });
    });
  
}

exports.updateVideoList = (req, res)=>{
  var { sub_title, order_number, label, course_id, video_id} = req.body;


      pool.getConnection((err, connection) => {
          if (err) throw err; // not connected
          console.log('Connected!');
    
          connection.query('UPDATE video_lists SET sub_title = ?, order_number = ?, label = ? WHERE id = ?',[sub_title, order_number, label, video_id], (err, rows) => {
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

exports.deleteVideo = (req, res)=>{

     var video_id = req.body.id;


      pool.getConnection((err, connection) => {
          if (err) throw err; // not connected
          console.log('Connected!');
    
          connection.query('DELETE FROM video_courses  WHERE id = ?',[video_id], (err, rows) => {
            // Once done, release connection
            //connection.release();
    
            if (!err) {
              connection.query('DELETE FROM video_lists  WHERE course_id = ?',[video_id], (err, rows) => {
              
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

exports.deleteVideoList = (req, res)=>{

  var video_id = req.body.id;


   pool.getConnection((err, connection) => {
       if (err) throw err; // not connected
       console.log('Connected!');
 
       connection.query('DELETE FROM video_lists  WHERE id = ?',[video_id], (err, rows) => {
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
