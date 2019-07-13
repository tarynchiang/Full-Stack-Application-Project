const express = require('express');
const router  = express.Router();
const Post    = require('../models/Post');

const passport = require('passport');

const uploadPhoto = require('../config/cloundinary-setup');


//see the posts
router.get('/posts',(req,res,next)=>{
    
    Post.find().populate('author')
    .then((allThePosts)=>{
        
        if(req.user){

            allThePosts.forEach((eachPost)=>{
                if(eachPost.author._id.equals(req.user._id)){
                    eachPost.owned = true;
                }
            })
        }
        res.render('postViews/allPosts',{posts: allThePosts})
    })
    .catch((err)=>{
        next(err);
    })
});

router.get('/posts/:country',(req,res,next)=>{

    Post.find({country: req.params.country}).populate('author')
    .then((allThePosts)=>{
        
        if(req.user){

            allThePosts.forEach((eachPost)=>{
                if(eachPost.author._id.equals(req.user._id)){
                    eachPost.owned = true;
                }
            })
        }
        res.render('postViews/postsWithCountry',{posts: allThePosts})
    })
    .catch((err)=>{
        next(err);
    })
});

router.get('/posts/:country/:city',(req,res,next)=>{

    Post.find({country: req.params.country, city:req.params.city}).populate('author')
    .then((allThePosts)=>{
        
        if(req.user){

            allThePosts.forEach((eachPost)=>{
                if(eachPost.author._id.equals(req.user._id)){
                    eachPost.owned = true;
                }
            })
        }
        res.render('postViews/postsWithCity',{posts: allThePosts})
    })
    .catch((err)=>{
        next(err);
    })
});

//create new post
router.get('/posts/create-new/:country/:city',(req,res,next)=>{
    
    res.render('postViews/newPost');
})

router.post('/posts/create-new/:country/:city',uploadPhoto.single('thePic'),(res,req,next)=>{


    let title = req.body.title;
    let content = req.body.content;
    let author = req.user._id;
    let country = req.params.country;
    //let region = ??
    //let likes = ??
    let city = req.params.city;
    let img = req.file.url;
    // let comments = ??

    
    // title: String,
    // content: String,
    // author: {type: Schema.Types.ObjectId, ref: 'User'},
    // country:String,
    // region:String,
    // city:String,
    // likes:[{ type : Schema.Types.ObjectId, ref: 'User' }],
    // img: String,
    // comments:[{ type : Schema.Types.ObjectId, ref: 'Comment' }]
})



module.exports = router;