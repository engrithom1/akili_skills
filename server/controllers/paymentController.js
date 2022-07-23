const pool = require('../config/dbconfig')
var data = require('../data')

const axios = require('axios')

var userInfo = data.userInfo

exports.payment = (req, res) => {
    //
    if(req.session.user){
       userInfo.isLoged = req.session.user.isLoged
       userInfo.user = req.session.user.user
    }

    res.render('payment',{userInfo:userInfo, style:"for_partials.css", title:"akili skills app"});

}
exports.makePayment =(req, res) =>{

    var phone_number = req.body.phone_number
    var username = req.body.username

    var payload = {
            api:170,
            code:104, 
            data:{
                api_key:"MDAzZTYzNjVkOWM1NDU4ZThjZGJkYTU2MTJmMDg3NDg=",
                secret:"pbkdf2_sha256$260000$7hoiL8enOqB06hYylekJVb$1lma0fbMn9+YPfXT320//+quAwM34zeMI47DKxDe4KM=",
                order_id:"12323",
                amount:2000,
                username:"akili kubwa",
                is_live :true,
                phone_number:phone_number,
                cancel_url:"http://localhost:8000/cancel",
                webhook_url:"http://localhost:8000/success",
                success_url:"http://localhost:8000/success",
                metadata:{
                    secret:"pbkdf2_sha256$260000$7hoiL8enOqB06hYylekJVb$1lma0fbMn9+YPfXT320//+quAwM34zeMI47DKxDe4KM=",
                }, 
                username:username,
                is_live : true
            }
    };

    axios({
        method: 'post',
        url: 'https://swahiliesapi.invict.site/Api',
        data: payload
      }).then(response => {
        console.log(response.data)
        if(response.data.code == 200){
            return res.send('like')
        }else if(response.data.code == 300){
            return res.send('bad key')
        }
        //console.log(response.data.explanation);
        
      })
      .catch(error => {
        
        console.log(error);
        return res.send('majangaa')
      });

    
}

exports.cancelPayment =(req, res) =>{
    
    console.log("requesties received")
    console.log(req.body)

}

exports.successPayment =(req, res) =>{
    
    console.log("requesties success")
    console.log(req.body)

}