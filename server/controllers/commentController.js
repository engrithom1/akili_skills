const pool = require('../config/dbconfig')
var data = require('../data')

var userInfo = data.userInfo

exports.allInOneComment = (req, res)=>{

    var post_id = req.body.post_id
    var post_type = req.body.post_type
    var comment = req.body.comment
    var user_id = req.body.user_id

    pool.getConnection((err, connection) => {
        if (err) throw err; // not connected
        console.log('Connected!');
  
        connection.query('INSERT INTO comments SET comment = ?, type = ? , post_id = ? , user_id = ?',[comment, post_type, post_id, user_id], (err, rows) => {
          // Once done, release connection
          //connection.release();
          if (!err) {
            comment_id = rows.insertId
            //return res.json({post_id,post_type,user_id,comment,comment_id});
            return res.render('partials/comment',{layout:false,comment_id,comment})
          } else {
            console.log("get video errors---------------------------------------");  
            console.log(err);
          }
  
        });
    });
    
}