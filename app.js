const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Welcome to my Blog!";
const aboutContent = "some about stuff";
const contactContent = "some contact stuff";

const app = express();
mongoose.connect("mongodb+srv://jsharick7:sterence18@cluster0-kahol.mongodb.net/blogDB", { useUnifiedTopology: true, useNewUrlParser: true});
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


const postSchema = {
  title:String,
  content:String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){
  Post.find({}, function(err, posts){
    res.render("home.ejs", {startingContent:homeStartingContent, posts: posts});
  })

});

app.get("/about", function(req, res){
  res.render("about.ejs", {aboutContent: aboutContent});
});
app.get("/contact", function(req, res){
  res.render("contact.ejs", {contactContent:contactContent});
});
app.get("/compose", function(req, res){
  res.render("compose.ejs");
});

app.post("/compose", function(req,res){
  const post = new Post ({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  post.save(function(err){
    if (!err){
        res.redirect("/");
    }
  });


});

app.get("/posts/:postID", function(req, res){
  const requestedPostID = (req.params.postID);
  Post.findOne({_id: requestedPostID}, function(err, post){
    res.render("post", {title:post.title, content:post.content});
  });

});



app.listen(process.env.PORT || 3000, function(){
  console.log("listening on port 3000");
});
