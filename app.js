const express = require("express");
const bodyparser = require("body-parser");
var users = []; 
var taskarray = [];
var li = 0 ;
users.push({
    name:   "administrator",
    tasks: ["this is the administrator ."]
});
var auth = 0;
const app = express();
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");
app.get("/",(req , res) => {
    res.render("login.ejs",{h : "LOGIN"});
});
function userdata(user){
    for(var i=0 ; i<users.length ; i++){
        if (user === users[i].name){
            taskarray = [];
            auth = 1;
            taskarray = users[i];
            break;
        }
        else{
            auth = 0;
        }
    }
    if (i===users.length){
        users.push({
            name: user,
            tasks:[] 
        });
        taskarray=users[i];
        auth = 10;
    }
}
app.post("/",(req,res) =>{
    var client = req.body.user;
    userdata(client);
    if (auth === 1 || auth === 10){
        res.redirect("/to_do");
    }
    else{
        res.send("Something not good");
    }
});
app.get("/to_do",(req,res) =>{
    if (taskarray.name == null ){
        res.redirect("/");
    }
    else{
        li = 0;
        res.render("home.ejs",{taskarray,li});     
    }
});
app.post("/to_do/delete",(req,res) =>{
    var valve=req.body.ttt;
    taskarray.tasks.splice(valve,1)
    res.redirect("/to_do");
});
app.post("/to_do",(req,res) =>{
    var taskentered = req.body.task;
    taskarray.tasks.push(taskentered);
    res.redirect("/to_do");
});
app.listen(process.env.PORT || 3000,() =>{
    console.log("Please visit the site.");
});