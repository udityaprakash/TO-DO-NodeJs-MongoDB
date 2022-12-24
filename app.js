const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const { render } = require("ejs");
// const alert = require("alert")
const app = express();
const hash = require("md5");

function connectdatabase(){

    mongoose.connect("mongodb+srv://udityaprakash:kBjVfH94vbTk1rJA@cluster0.pbkthhd.mongodb.net/?retryWrites=true&w=majority", (err) => {
        // mongoose.connect("mongodb+srv://udityaprakash01:sAMc1FmiB4wWnxAx@cluster0.za5wk8j.mongodb.net/?retryWrites=true&w=majority",(err)=>{    
        if (!err) {
            console.log("db connected successfully");
        } else {
            console.log("Retrying connecting to database");
            connectdatabase();
        }
    });
}

connectdatabase();

const userSchema = new mongoose.Schema({
    name : {
     type:String,
     min:8,
    },
    password: {
        type:String,
        min:8,
       },
    mobileno: {
        type:Number,
        min:5000000000,
       },
    tasks: Array
});

const userData = mongoose.model("user",userSchema);

app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");
var li=0;


app.get("/",(req , res) => {
    res.render("login.ejs",{h : "LOGIN",msg:''});
});
async function findingclient(client,clientpass){
  var u = await userData.find({name:client,password:clientpass});
  console.log(u[0]);
  if(u.length==0){
    console.log("no user found\n");
    return false;
  }
  else{
    console.log("user found");
    return u[0]._id; 
  }
}

app.post("/",async (req,res) =>{
    var client = req.body.usern;
    auth = 0;
    n = 10;
    var clientpass = hash(req.body.passn); 
    var id =  await findingclient(client,clientpass);  
    // console.log(id);
    if(id!=''){
        res.redirect("/todo?id="+id);
    }else{
        // alert("No Such User Found..");
        res.render("login.ejs",{h : "LOGIN",msg:'No such user Found'});
    }
    });

app.get("/todo",async (req,res) => {
    var usertask = [];
    var id = req.query.id;
    if (typeof id=='undefined'){
        res.redirect("/");
    }
    li=0;

    const result = await userData.findOne({'_id' : id});
    console.log(result);
    usertask = result.tasks;
    li=0;
    var userid=result._id;
    var username = result.name;
    res.render("home.ejs",{userid,username , usertask,li});
});

async function user(id){
    var u = await userData.findOne({'_id':id});
  if(u.length==0){
    console.log("no user found\n");
  }
  else{
    return u; 
  }
}

app.post("/todo",async (req,res) =>{
    var valve=req.body.task;
    var userid=req.body.id;
    console.log("id :"+userid+" "+valve);
    let doc = await userData.findOneAndUpdate({_id:userid},
       { $push: {tasks : valve}
    }).catch(err =>{
        console.log("error in adding into datanase\n");
       });
    res.redirect("/todo?id="+userid);   
});
app.post("/deleting",async (req,res) =>{
    var taskno = req.body.ttt;
    var id=req.body.id;
    const taskt = "tasks."+taskno;
    await userData.updateOne({"_id":id},{$unset:{"tasks.0":1}});
    await userData.updateOne({"_id":id},{$pull:{"tasks":null}});

    
    res.redirect("/todo?id="+id);
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
    let password = hash(req.body.npass);
    let mobile = req.body.phoneno;
    createuser(user,password,mobile);
    // console.log(user + " " + password + " "+ mobile);
    res.redirect("/");

})
app.listen(process.env.PORT || 3000,() =>{
    console.log("Please visit the site.");
})