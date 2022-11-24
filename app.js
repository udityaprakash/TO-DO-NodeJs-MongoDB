const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const { render } = require("ejs");
const alert = require("alert")
const app = express();
var auth = 0;
var n=0;

mongoose.connect("mongodb://localhost:27017/TaskDB");
const userSchema = new mongoose.Schema({
    name : String,
    password: String,
    mobileno: Number,
    tasks: Array
});

const userData = mongoose.model("user",userSchema);

app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");
var li=0;


app.get("/",(req , res) => {
    alert("welcome");
    res.render("login.ejs",{h : "LOGIN"});
});
// var ur1 = new userData({
//     name : "adminin9838",
//     password: "adminin9838",
//     mobileno: 9838652965,
//     tasks: ["hello1","hello2"]
// });
// ur1.save((err)=>{
//     if(err){
//         console.log(err);
//     }
//     else{
//         console.log("successfully added");
//     }
// });
function findingclient(client,clientpass){
    userData.find({name:client,password:clientpass},(err,u) => {
        if(!err){

            // console.log("\n the length in database - "+u.length+"\n");
            // for(let i=0;i<u.length;i++){
            //     if (client == u[i].name && clientpass == u[i].password){
                    auth = 1;
                //     console.log("user data found");
                // }else{
                //     n = 0;
                // }
            }
        // }
        else{
            console.log("error while contacting the server\n"+err);
        }
        });
}

app.post("/",(req,res) =>{
    var client = req.body.usern;
    auth = 0;
    n = 10;
    var clientpass = req.body.passn;
    findingclient(client,clientpass);
    
    if(n == 0 && auth != 1){
        alert("No Such User Found..");
    }else{
        res.redirect("/todo?username="+client+"&&"+"pass="+clientpass);
    }
    });

app.get("/todo",(req,res) =>{
    var usertask = [];
    var username = req.query.username;
    var passwor=req.query.pass;
    li=0;
    console.log(username+" "+passwor+" redirected successfully \n");
    // userData.findOne({'name' : username,password:passwor},'tasks',(err,result) =>{
    //     if(!err){
    //         usertask = result.tasks;
    //         console.log(result.tasks);
    //         // console.log("Id: "+result._id.toString());
    //         // console.log("user data taken from database \n"+result[0]+"\n");
    //         // li=0;
    //         // console.log(usertask);
    //         // res.send(usertask);
    //         userid = result._id.toString();
    //         console.log("Id: "+userid);
    //         res.render("home.ejs",{userid,username , usertask,li});
    //     }else{
    //         console.log("error while matching from server \n"+err);

    //         res.redirect("/");
    //     }

    // });
    // if (taskarray.name == null ){
    //     res.redirect("/");
    // }
    // else{
    //     li = 0;
    //     res.render("home.ejs",{taskarray,li});     
    // }
});
app.post("/todo-:user",async (req,res) =>{
    var valve=req.body.task;
    var userid=req.body.id;
    var username = req.params.user;
    console.log("id :"+userid+" "+valve+" "+username);
    let doc = await userData.findOneAndUpdate({_id:userid},
       { $push: {tasks : valve}
    }).catch(err =>{
        console.log("error in adding into datanase\n");
       });
    res.redirect("/todo-"+username);   
});
app.post("/deleting",(req,res) =>{
    var taskno = req.body.ttt;
    var id=req.body.id;
    userData.updateOne({_id:id},{})

    
    res.redirect("/to_do");
});
async function createuser(user,passwor,mobile){
    var us_1 = new userData({
        name: user,
        password: passwor,
        mobileno: mobile,
        tasks:[]
    });
    console.log("\n Creating new user \n")
    await us_1.save();
}
app.get("/signup",(req,res)=>{
    res.render("signup.ejs",{h: "SignUp"});
})
app.post("/signup",(req,res)=>{
    let user = req.body.nuser;
    let password = req.body.npass;
    let mobile = req.body.phoneno;
    createuser(user,password,mobile);
    console.log(user + " " + password + " "+ mobile);
    res.redirect("/");

})
app.listen(process.env.PORT || 3000,() =>{
    console.log("Please visit the site.");
})
