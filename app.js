require("dotenv").config();
const express=require("express");
const bodyParser=require("body-parser");
const app=express();
const mongoose=require("mongoose");
const _=require("lodash");
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("static"));
mongoose.connect("mongodb+srv://admin-girdhar:"+process.env.pwd+"@todo.s6g72.mongodb.net/todolist",{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:false});
const itemsSchema=new mongoose.Schema({
  content:{
    type:String,
    required:[true,"Please specify the content"]
  }
});
const listSchema=new mongoose.Schema({
  name:String,
  items:[itemsSchema]
})
const item=mongoose.model("Item",itemsSchema);
const list=mongoose.model("List",listSchema);
const item1=new item({
  content:"Good to see you. Want to add some thing.."
});
const defitems=[item1];

app.get("/", function(req, res) {
  res.redirect("/Today");
});
app.get("/:title",function(req,res){
  const dest=_.capitalize(req.params.title);
  list.findOne({name:dest},function(err,listitem){
    if(!listitem)
    {
      const ls=new list({
        name:dest,
        items:defitems
      });
      ls.save();
      res.render("list",{listTitle:dest,newListItems:defitems});
    }
    else
      res.render("list",{listTitle:dest,newListItems:listitem.items});
  });
  // console.log(dest);
});
app.post("/",function(req,res){
  // console.log(req.body);
  const cnt= req.body.newitem;
  const title=req.body.submit;
  const item0=new item({
    content:cnt
  })
  list.findOne({name:title},function(err,itm){
      itm.items.push(item0);
      itm.save();
      res.redirect("/"+title);
    })
});
app.post("/remove",function(req,res){
  // console.log(req.body);
    title=req.body.listTitle;
      list.findOneAndUpdate({name:title},{
        $pull:{items:{_id:req.body.checkbox}}
      },function(err,itm){
        if(!err)
        {
          res.redirect("/"+title);
        }
      });
});
app.post("/search",function(req,res){
  res.redirect("/"+req.body.listname);
});
let port=process.env.PORT;
if(port==null || port=="")
port=3000;
app.listen(port,function(){
    console.log("Server started successfully");
});