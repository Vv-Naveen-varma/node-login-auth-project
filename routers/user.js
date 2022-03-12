const express = require('express');
// const req = require('express/lib/request');
const router = new express.Router();
const mysql = require('mysql');

// Call home page
router.get('/',(req,res)=>{
    res.render('home');
});

// Call signup page
router.get('/usersignup',(req,res)=>{
    res.render('signup');
});

// Call home page
router.get('/userlogin',(req,res)=>{
    res.render('home');
});

var connection = mysql.createConnection({
    host            : process.env.DB_HOST,
    user            : process.env.DB_USER,
    password        : process.env.DB_PASS,
    database        : process.env.DB_NAME
});

connection.connect(function(err){
    if(err) throw err;
});

// Validate user and call user-profile page
router.post('/userlogin',(req,res)=>{
    console.log("/userlogin post request received");
    // let request_body = JSON.parse(JSON.stringify(req.body));

    const {email, password} = req.body;
        
    connection.query('select email,password from users where email=? and password=?',[email,password],(err,rows)=>{
        if(!err){
            if(rows.length==0){
                console.log("Invalid user data provided!");
                const alert = "User not found";
                res.render('home.hbs',{email,password,alert});
            }else{
                connection.query('select fname,lname,phone,email from users where email=?;',email,(new_err,new_rows)=>{
                    if(!new_err){
                        console.log("Valid Email provided!");
                        const {fname,lname,phone,email}=new_rows[0];
                        res.render('userpage',{fname,lname,phone,email});
                    }else{
                        console.log(err);
                    }
                });
            }
        }else{
            console.log(err);
        }
    });
});

// Store new user details in Mysql DB
router.post('/usersignup',(req,res)=>{
    // let data = JSON.parse(JSON.stringify(req.body));
    const {fname,lname,phone,email,password}=req.body;
    
    connection.query('select email from users', (err, rows)=>{
        if(err){
            console.log("Error in /usersignup");
            res.render('signup');
        }else{
            var insert = true;
            if(rows.length > 0){
                for(i=0;i<rows.length;i++){
                    if(rows[i].email == email){
                        insert = false
                        alert="User already exists!"
                        res.render('signup',{alert});
                        break;
                    }
                }
            }
            if(insert){
                connection.query('insert into users set fname=?,lname=?,phone=?,email=?,password=?;', [fname,lname,phone,email,password], (err, rows)=>{
                    // When done with connection , release it
                    if(!err){
                        console.log("User data added to DB!")
                        alert="User added!"
                        res.render('home',{alert});
                    }else{
                        console.log(err);
                    }
                });
            }
        }
    });
});


module.exports = router;
