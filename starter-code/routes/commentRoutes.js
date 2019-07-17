const express = require('express');
const router  = express.Router();
const Comment = require('../models/Comment');
const Post    = require('../models/Post');


router.post('/comments/create',(req,res,next)=>{

        Comment.create({
            content: req.body.content,
            author: req.user._id,
            post:req.body.postid
        })
        .then((theComment)=>{
            if(theComment.author._id.equals(req.user._id)){
                theComment.owned = true;
            }
            Post.findByIdAndUpdate(req.body.postid,{$push:{comments: theComment}})
            .then(()=>{

                res.json(theComment);
            })
            .catch((err)=>{
                console.log(err);
            })
        })
        .catch((err)=>{
            console.log(err);
        })
})
    
router.post('/comments/delete',(req,res,next)=>{
    
    Post.findById(req.body.postID)
    .then((thePost)=>{
        console.log('index',req.body.index);
        thePost.comments.splice(req.body.index,1);
        thePost.save()
        .then((x)=>{
            res.json(x);
        })
        .catch((err)=>{
            next(err);
        })
    })
    .catch((err)=>{
        next(err);
    })

})
module.exports = router;
