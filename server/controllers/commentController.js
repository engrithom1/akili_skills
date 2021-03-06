const pool = require('../config/dbconfig')
var data = require('../data')

var userInfo = data.userInfo

exports.likeComment = (req, res)=>{

    console.log(req.session.user)
    var comment_id = req.body.comment_id
    var comment_by = req.body.comment_by
    var user_id = req.session.user.user.id


    var query = "UPDATE comments SET likes = ? WHERE id = ?;"
        query += "INSERT INTO comment_likes  SET comment_by = ?, comment_id = ?, like_by = ?;"

    var exist_query = "UPDATE comments SET likes = ? WHERE id = ?;"
        exist_query += "DELETE FROM comment_likes WHERE comment_id = ? AND like_by = ?;"    

    pool.getConnection((err, connection) => {
      if (err) throw err; // not connected console.log('Connected!');
      
      connection.query("SELECT likes FROM comments WHERE id = ?",[comment_id], (err, rows) =>{
          
        if(!err){
          var likes = rows[0].likes
          

          connection.query("SELECT * FROM comment_likes WHERE comment_id = ? AND like_by = ?",[comment_id, user_id], (err, rows) =>{
              if(!err){

                  if(rows.length == 0){
                    likes = parseInt(likes) + 1

                    connection.query(query,[likes, comment_id, comment_by, comment_id, user_id], (err, rows) =>{
                      if(!err){
                      return res.send('like')
                      }else{
                        console.log(err)
                      }
                    })

                  }else{

                    likes = parseInt(likes) - 1

                    connection.query(exist_query,[likes, comment_id, comment_id, user_id], (err, rows) =>{
                      if(!err){
                        return res.send('exist')
                      }else{
                        console.log(err)
                      }
                    })  
                  }
              }else{
                 console.log(err)
              }
          })

        }else{
          console.log(err)
        }

      })

    })  

    console.log(req.session.user)

}

exports.allInOneComment = (req, res)=>{

    var post_id = req.body.post_id
    var post_type = req.body.post_type
    var comment = req.body.comment
    var user_id = req.session.user.user.id

    console.log(req.session.user)

    pool.getConnection((err, connection) => {
        if (err) throw err; // not connected
        console.log('Connected!');
  
        connection.query('INSERT INTO comments SET comment = ?, type = ? , post_id = ? , user_id = ?',[comment, post_type, post_id, user_id], (err, rows) => {
          // Once done, release connection
          //connection.release();
          if (!err) {
            var comment_id = rows.insertId
            connection.query('SELECT cm.comment, cm.likes, cm.id AS comment_id, us.username, us.avator, cm.user_id AS comment_by FROM comments AS cm INNER JOIN users AS us ON cm.user_id = us.id WHERE cm.id = ?;',[ comment_id], (err, rows) => {
               if(!err){
                var commentz = rows[0];
                console.log(commentz)
                var comment = commentz.comment
                var likes = commentz.likes
                var comment_id = commentz.comment_id
                var comment_by = commentz.comment_by
                var avator = commentz.avator
                var username = commentz.username
                return res.render('partials/comment',{layout:false,comment,likes,comment_id,comment_by,avator,username})
               }else{
                console.log(err);
               }
            })
            
          } else {
            console.log("get video errors---------------------------------------");  
            console.log(err);
          }
  
        });
    });
    
}

exports.discussionReply = (req, res)=>{

  var post_id = req.body.post_id
  var comment = req.body.comment
  var user_id = req.session.user.user.id

  //console.log(req.session.user)
var query = "SELECT rp.reply, rp.likes, rp.id AS reply_id,  us.username, us.avator, rp.user_id AS reply_by FROM replies AS rp INNER JOIN users AS us ON rp.user_id = us.id WHERE rp.id = ?;"
    query += "SELECT replies FROM discussion WHERE id = ?;"

  pool.getConnection((err, connection) => {
      if (err) throw err; // not connected
      console.log('Connected!');

      connection.query('INSERT INTO replies SET reply = ? , post_id = ? , user_id = ?',[comment, post_id, user_id], (err, rows) => {
        // Once done, release connection
        //connection.release();
        if (!err) {
          var reply_id = rows.insertId
          connection.query(query,[reply_id, post_id], (err, rows) => {
             if(!err){
              console.log(rows)
              var replies = rows[0][0]
              var reps = rows[1][0].replies
              var reps = reps + 1

              //console.log(commentz)
              var reply = replies.reply
              var likes = replies.likes
              var reply_id = replies.reply_id
              var reply_by = replies.reply_by
              var avator = replies.avator
              var username = replies.username

              connection.query("UPDATE discussion SET replies = ? WHERE id = ?",[reps,post_id],(err,rows)=>{
                if(!err){
                  return res.render('partials/reply',{layout:false,reply,likes,reply_by,reply_id,avator,username})
                }
              })
             }else{
              console.log(err);
             }
          })
          
        } else {
          console.log("get video errors---------------------------------------");  
          console.log(err);
        }

      });
  });
  
}