const express = require("express");
const app = express();
const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const path = require("path");
const methodOverride = require('method-override')
let port = 3000;

app.set("view engine", "ejs");
app.set("views",path.join(__dirname, "/views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended: true}));


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'my_app',
    password: 'class7thE.',
  });


 let getRandomUser =()=> {
    return [
      faker.datatype.uuid(),
      faker.internet.userName(),
      faker.internet.email(),
      faker.internet.password(),
    ];
  };


  // HOMEPAGE
app.get("/", (req,res) =>{
    let q = 'SELECT count(*) FROM user';
    try{
    connection.query( q, (err, result) =>{
        if (err) throw err;
        let count = result[0]["count(*)"];
        res.render("home.ejs", {count});
    })
    
} catch(err){
    console.log(err);
    res.send("Error has Occured")
}
});


//SHOW USES DATA
app.get("/users",(req, res)=>{
    let q= "SELECT * FROM user";
    try{
    connection.query( q , (err, users) =>{
        if (err) throw err;
        res.render("users.ejs", {users})
    })
} catch(err){
    console.log(err);
};
})

//EDIT ROUTE


app.get("/user/:id/edit", (req,res) => {
    let {id} = req.params;
    let q = `SELECT * FROM user WHERE userid='${id}'`;
    try{
    connection.query(q,  (err, result) =>{
        if (err) throw err;
        let user= result[0];
        res.render("edit.ejs", {user});
    })
} catch(err){
    console.log(err);
};
});


// UPDATE ROUTE

app.patch("/user/:id",(req,res)=>{
    let {id} = req.params;
    let {password: formpass, username: newusername}= req.body;
    let q = `SELECT * FROM user WHERE userid='${id}'`;
    try{
        connection.query(q,  (err, result) =>{
            if (err) throw err;
            let user= result[0];
            if(formpass != user.password){
                res.send("Wrong password");
            } 
            else {
                let q2= `UPDATE user SET username='${newusername}' WHERE userid ='${id}'`;
                connection.query(q2, (err, result)=>{
                    if (err) throw err;
                    res.redirect("/users");
                });
            }
        });
    } catch(err){
        console.log(err);
    };
});

app.get("/user/new",(req, res)=>{
     res.render("new.ejs");
})

app.post("/users", (req,res)=>{
    let{userid, username, email, password} = req.body;

    let q= 'INSERT INTO user (userid, username, email, password) VALUES (?, ?, ?, ?)';
    try{
    connection.query(q,[userid, username, email, password], (err, result) =>{
        if (err) throw err;
        res.redirect("/users")
    })
} catch(err){
    console.log(err);
    res.send("error")
};
})


app.delete("/user/:id",(req,res)=>{
    let {id}= req.params;
    let q = `DELETE FROM user WHERE userid = ?`; 
     try{
            connection.query(q,[id], (err, result) =>{
                if (err) throw err;
                res.redirect("/users");
            })
        } catch(err){
            console.log(err);
        };
})




app.listen(port, ()=>{
    console.log(`Server is running on Port ${port}`)
});

