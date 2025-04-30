const { faker } = require('@faker-js/faker');

const mysql = require("mysql2");
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const { v4: uuidv4 } = require('uuid');

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended : true}));
app.set("view engine","ejs");
app.set("views" , path.join(__dirname , "/views"));

let port = 8080;



const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'delta_app',
    password: 'Theja@143'
  });
  
  let getRandomUser = () =>{
    return [
       faker.string.uuid(),
       faker.internet.username(), // before version 9.1.0, use userName()
       faker.internet.email(),
       faker.internet.password(),
    ];
  }

  let q = "insert into user (id , username , email,password) values ?";
  
  // let data = [];
  // for(let i=1 ; i<=100 ; i++){
  //   data.push(getRandomUser());
  // }
  
  // try{
  //   connection.query(q ,[data], (err,result)=>{
  //       if(err) throw err;
  //      console.log(result);
  //     });
    
  // }catch(err){
  //   console.log(err);
  // };
 


  app.get("/",(req,res) =>{
    let q = "select count(*) from user";
     try{
      connection.query(q,(err,result) =>{
        if(err) throw err;
        let count = result[0]["count(*)"];
        res.render("home.ejs", {count});
        // res.send(count);
      })
    }catch (err){
     res.send("some error occured");
    }
  });


  //show users
  app.get("/user",(req,res) =>{
    let q = "select * from user";
    try{
      connection.query(q,(err,result)=>{
        if(err) throw err;
        let users = result;
        // console.log(data);
        res.render("users.ejs",{users});
      })
    }catch(err){
      res.send("Error occured");
    }
  })

  //edit route
  app.get("/user/:id/edit" , (req,res)=>{
    let {id} = req.params;
    let q = `select * from user where id='${id}'`;
    try{
      connection.query(q,(err,result)=>{
        if(err) throw err;
        let user = result[0];
      res.render("edit.ejs" , {user});
      })
    }catch(err){
      res.send("Error occured");
    }
  });
   
  //update route
  // app.patch("/user/:id" , (req,res) =>{
  //   console.log("hii");
  //  res.send("Updated");
  // });
 
  app.patch("/user/:id" , (req,res)=>{
    let {id} = req.params;
    let {password: formPass , username: newUsername} = req.body;
    let q = `select * from user where id='${id}'`;
    try{
      connection.query(q,(err,result)=>{
        if(err) throw err;
        let user = result[0];
        if(formPass != user.password){
          res.send("Wrong Password");
        }else{
          let q2 = `update user set username='${newUsername}' where id='${id}'`;
          connection.query(q2 , (err,result)=>{
           if(err) throw err;
           res.redirect("/user");
          })
        }

      })
    }catch(err){
      res.send("Error occured");
    }
  });

  app.get("/user/add",(req,res) =>{
    // res.send("it is working");
    res.render("add.ejs");
  });

  app.post("/user" , (req,res)=>{
    let id=uuidv4();
    let {username , email , password} = req.body;
    let userArray = [id,username, email, password];
    let q = "insert into user (id , username , email,password) values ?"
    try{
    connection.query(q,[[userArray]],(err,result)=>{
      if(err) throw err;
      // res.render("users.ejs",{userArray});
      res.redirect("/user")
    })
    }catch(err){
      res.send("Error occured");
    }
  });

  app.delete("/user/:id" , (req,res) =>{
    let {id} = req.params;
    let q = `DELETE FROM user WHERE id='${id}'`;
    connection.query(q,(err,result)=>{
      res.redirect("/user");
    })
  });

  app.listen(port, ()=>{
    console.log(`you are listening ${port}.`)
  });
  
   
  // connection.end();

