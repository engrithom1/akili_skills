const pool = require('../config/dbconfig')
var data = require('../data')

var richFunctions = require('../richardFunctions')
var userInfo = data.userInfo

exports.singleBook = (req, res) => {

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
    var query = "SELECT * FROM books WHERE status = 'active' ORDER BY views ASC LIMIT 5;"
    query += 'SELECT * FROM books WHERE id = ?;'
    query += 'SELECT cm.comment, cm.likes, cm.id AS comment_id,  us.username, us.avator, cm.user_id AS comment_by FROM comments AS cm INNER JOIN users AS us ON cm.user_id = us.id WHERE cm.post_id = ? AND cm.type = ? ORDER BY cm.id DESC;'

    connection.query(query, [post_id,post_id,'book'], (err, results, fields) => {
      
      var book = results[1][0];
      var books = results[0];
      var comments = results[2];

      ////seo datas
      var title = book.title
      var description = book.description
          description.substr(0, 200)
      var slug = book.slug
      
      var views = book.views
      views = parseInt(views) + 1

      if (!err) {
        connection.query("UPDATE books SET views = ? WHERE id = ?",[views,post_id],(err,rows)=>{
           if(!err){
              res.render('single/book', {userInfo: userInfo, comments, books, book, style: "for_partials.css", title,description,slug });
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

    var user_id = req.session.user.user.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    imageFile = req.files.thumbnail;
  

    var name = imageFile.name
    var nameArry = name.split(".")
    var ext = nameArry[nameArry.length - 1]
    var filename = "book"+time.getTime() +'.'+ext;

    //uploadPath = '/skillapp/uploads/images/' + filename;
    uploadPath = path.join(__dirname, '../../uploads/images/'+filename);

    bookFile = req.files.bookpdf;

    var name = bookFile.name
    var nameArry = name.split(".")
    var ext = nameArry[nameArry.length - 1]
    var bookname = "book"+time.getTime() +'.'+ext;
    //bookPath = '/skillapp/uploads/books/' + bookname;
    bookPath = path.join(__dirname, '../../uploads/books/'+bookname);

      // Use mv() to place file on the server
    imageFile.mv(uploadPath, function (err) {
    bookFile.mv(bookPath, function (err) {
        if (err) return res.status(500).send(err);
    });    
    if (err) return res.status(500).send(err);

    pool.getConnection((err, connection) => {
      if (err) throw err; // not connected
      console.log('Connected!');

      connection.query('INSERT INTO books SET title = ?,size = ?, year = ?, pages = ?, author = ?, status = ? , description = ? , price = ?, thumbnail = ?, book_url = ?, created_by = ?',[title,'1.2', year, pages, author, status, description, price, filename, bookname, user_id], (err, rows) => {
        // Once done, release connection
        //connection.release();

        if (!err) {
          var id = rows.insertId
          var slug = richFunctions.getSlug(title,id,60)

          connection.query("UPDATE books SET slug = ? WHERE id = ?",[slug, id], (err,rows)=>{
              if(!err){
                res.redirect('/account/book');
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

exports.updateBook = (req, res)=>{
    var { title, description, price, status, year, pages, author, post_id} = req.body;
    var time = new Date()
    let imageFile
    let uploadPath

    var user_id = req.session.user.user.id;

    var slug = richFunctions.getSlug(title,post_id,60)

    if (!req.files || Object.keys(req.files).length == 0) {

        pool.getConnection((err, connection) => {
            if (err) throw err; // not connected
            console.log('Connected!');
      
            connection.query('UPDATE books SET title = ?, slug = ?, size = ?, year = ?, pages = ?, author = ?, status = ? , description = ? , price = ?, thumbnail = ?, book_url = ?, created_by = ? WHERE id = ?',[title, slug,'1.2', year, pages, author, status, description, price, filename, user_id, post_id], (err, rows) => {
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
        //return res.status(400).send('No files were uploaded.');
    }else{

    imageFile = req.files.thumbnail;
    var name = imageFile.name
    var nameArry = name.split(".")
    var ext = nameArry[nameArry.length - 1]
    var filename = "book"+time.getTime() +'.'+ext;
    //console.log(imageFile)
    //uploadPath = '/skillapp/uploads/images/' + filename;
    uploadPath = path.join(__dirname, '../../uploads/images/'+filename);

      // Use mv() to place file on the server
    imageFile.mv(uploadPath, function (err) {
    if (err) return res.status(500).send(err);

    pool.getConnection((err, connection) => {
      if (err) throw err; // not connected
      console.log('Connected!');

      connection.query('UPDATE books SET title = ?, slug = ?, size = ?, year = ?, pages = ?, author = ?, status = ? , description = ? , price = ?, thumbnail = ?, book_url = ?, created_by = ? WHERE id = ?',[title, slug,'1.2', year, pages, author, status, description, price, filename, user_id, post_id], (err, rows) => {
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

