const express = require('express');
const router  = express.Router();
const Post    = require('../models/Post');

const passport = require('passport');


router.get('/list-all-posts',(req,res,next)=>{
    
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




module.exports = router;