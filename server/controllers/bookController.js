const pool = require('../config/dbconfig')
var data = require('../data')

var userInfo = data.userInfo
////constroller functions
exports.accountBook = (req, res)=>{
  if(req.session.user){
    userInfo.isLoged = req.session.user.isLoged
    userInfo.user = req.session.user.user
 }
    pool.getConnection((err, connection) => {
        if (err) throw err; // not connected
        //console.log('Connected!');
  
        connection.query('SELECT * FROM books ORDER BY id DESC', (err, rows) => {
          // Once done, release connection
          //connection.release();
  
          if (!err) {
            res.render('account/book',{userInfo:userInfo,books:rows,style:"account.css", title:"Book Dashbord Page"})
          } else {
            console.log(err);
            console.log("errors------------------------------------book");
          }
  
        });
      });
    
}

exports.getBookEdit = (req, res)=>{
    var id = req.body.id

    pool.getConnection((err, connection) => {
        if (err) throw err; // not connected
        console.log('Connected!');
  
        connection.query('SELECT * FROM books WHERE id = '+id, (err, rows) => {
          // Once done, release connection
          //connection.release();
          if (!err) {
            return res.json(rows);
          } else {
            console.log("get book errors---------------------------------------");  
            console.log(err);
          }
  
        });
      });
    
}

exports.createBook = (req, res)=>{
    var { title, description, price, status, year, pages, author,} = req.body;
    var time = new Date()
    let imageFile
    let uploadPath
    let bookFile
    let bookPath

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    imageFile = req.files.thumbnail;
    var filename = 'audio'+time.getTime()+imageFile.name;
    uploadPath = '/skillapp/uploads/images/' + filename;

    bookFile = req.files.bookpdf;
    var bookname = time.getTime()+bookFile.name;
    bookPath = '/skillapp/uploads/books/' + bookname;

      // Use mv() to place file on the server
    imageFile.mv(uploadPath, function (err) {
    bookFile.mv(bookPath, function (err) {
        if (err) return res.status(500).send(err);
    });    
    if (err) return res.status(500).send(err);

    pool.getConnection((err, connection) => {
      if (err) throw err; // not connected
      console.log('Connected!');

      connection.query('INSERT INTO books SET title = ?,size = ?, year = ?, pages = ?, author = ?, status = ? , description = ? , price = ?, thumbnail = ?, book_url = ?, created_by = ?',[title,'1.2', year, pages, author, status, description, price, filename, bookname, 1], (err, rows) => {
        // Once done, release connection
        //connection.release();

        if (!err) {
          res.redirect('/account/book');
        } else {
          console.log("errors---------------------------------------");  
          console.log(err);
        }

      });
    });

    // res.send('File uploaded!');
  });

    
}

exports.updateBook = (req, res)=>{
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

exports.deleteBook = (req, res)=>{

     var book_id = req.body.id;


      pool.getConnection((err, connection) => {
          if (err) throw err; // not connected
          console.log('Connected!');
    
          connection.query('DELETE FROM books  WHERE id = ?',[book_id], (err, rows) => {
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

