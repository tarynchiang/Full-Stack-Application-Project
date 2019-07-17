const express = require('express');
const router  = express.Router();
const Post    = require('../models/Post');
const Comment = require('../models/Comment');
const uploadPhoto = require('../config/cloundinary-setup');


//see worldwide posts
router.get('/posts',(req,res,next)=>{
    
    Post.find().populate('author').populate({path:'comments',populate:{path:'author'}})
    .then((allThePosts)=>{

        let allTheCountries = require ('full-countries-cities').getCountryNames();
        if(req.user){

            allThePosts.forEach((eachPost)=>{
                if(eachPost.author._id.equals(req.user._id)){
                    eachPost.owned = true;
                }
                eachPost.comments.forEach((eachComment)=>{
                    if(eachComment.author._id.equals(req.user._id)){
                        eachComment.owned = true;
                    }
                })
            })
        }
        res.render('postViews/allPosts',{posts: allThePosts, countries :allTheCountries})
    })
    .catch((err)=>{
        next(err);
    })
});

//create new post under country
router.get('/posts/create-new/:country',(req,res,next)=>{
    if(!req.user){
        req.flash('error','must be logged in to add posts')
        res.redirect('/login');
    }
    let allTheCities = require ('full-countries-cities').getCities(req.params.country);
    res.render('postViews/newPostWithCountry', {theCountry:req.params.country, cities: allTheCities});
})

router.post('/posts/create-new/:country',uploadPhoto.single('thePic'),(req,res,next)=>{


    let title = req.body.title;
    let content = req.body.content;
    let author = req.user._id;
    let country = req.params.country;
    let likes = [] 
    let city = req.body.city;
    let comments = [] 
    let img;
    
    if(req.file){
        img = req.file.url;
    }else{
        img = undefined;
    }
    
    Post.create({
        title:   title,
        content: content,
        author:  author,
        country: country,
        city: city,
        likes: likes,
        img: img,
        comments: comments
    })
    .then(()=>{
        console.log('success')
        res.redirect('/posts/'+ country);
    })
    .catch((err)=>{
        console.log('fail')
        next(err);
    })
})


//create new post under city
router.get('/posts/create-new/:country/:city',(req,res,next)=>{
    if(!req.user){
        req.flash('error','must be logged in tp add posts')
        res.redirect('/login');
    }
    // let allTheCities = require ('full-countries-cities').getCities(req.params.country);
    res.render('postViews/newPostWithCity', {theCountry:req.params.country, theCity:req.params.city});
})

router.post('/posts/create-new/:country/:city',uploadPhoto.single('thePic'),(req,res,next)=>{

    let title = req.body.title;
    let content = req.body.content;
    let author = req.user._id;
    let country = req.params.country;
    let likes = [] 
    let city = req.params.city;
    let img;
    
    if(req.file){
        img = req.file.url;
    }else{
        img = undefined;
    }
    
    let comments = [] 

    Post.create({
        title:   title,
        content: content,
        author:  author,
        country: country,
        city: city,
        likes: likes,
        img: img,
        comments: comments
    })
    .then(()=>{
        console.log('success with city')
        res.redirect('/posts/'+country+'/'+city);
    })
    .catch((err)=>{
        console.log('fail')
        next(err);
    })
})


//edit Post under worldwide
router.get('/posts/edit/:id',(req,res,next)=>{

    Post.findById(req.params.id)
    .then((postFromDB)=>{
        res.render('postViews/editPostWithAll',{thePost: postFromDB})
    })
    .catch((err)=>{
        next(err);
    })

});

router.post('/posts/update/:postID', (req, res, next)=>{
    let theID = req.params.postID;
    Post.findByIdAndUpdate(theID, req.body)
    .then((post)=>{
        res.redirect('/posts');
    })
    .catch((err)=>{
        next(err);
    })
})




//edit Post under country
router.get('/posts/edit/:id/country',(req,res,next)=>{

    Post.findById(req.params.id)
    .then((postFromDB)=>{
        res.render('postViews/editPostWithCountry',{thePost: postFromDB})
    })
    .catch((err)=>{
        next(err);
    })

});

router.post('/posts/update/:postID/country', (req, res, next)=>{
    let theID = req.params.postID;
    Post.findByIdAndUpdate(theID, req.body)
    .then((post)=>{
        res.redirect('/posts/'+post.country);
    })
    .catch((err)=>{
        next(err);
    })
})



//edit Post under city
router.get('/posts/edit/:id/city',(req,res,next)=>{

    Post.findById(req.params.id)
    .then((postFromDB)=>{
        res.render('postViews/editPostWithCity',{thePost: postFromDB})
    })
    .catch((err)=>{
        next(err);
    })

});

router.post('/posts/update/:postID/city', (req, res, next)=>{
    let theID = req.params.postID;
    Post.findByIdAndUpdate(theID, req.body)
    .then((post)=>{
        res.redirect('/posts/'+post.country+'/'+post.city);
    })
    .catch((err)=>{
        next(err);
    })
})



//delete the worldwide post 
router.post('/posts/delete/:id', (req, res, next)=>{

    Post.findByIdAndRemove(req.params.id)
    .then(()=>{
        res.redirect('/posts');
    })
    .catch((err)=>{
        next(err);
    })

})

//delete the post under country
router.post('/posts/delete/:id/:country', (req, res, next)=>{
    let country = req.params.country
    Post.findByIdAndRemove(req.params.id)
    .then(()=>{
        res.redirect('/posts/'+country);
    })
    .catch((err)=>{
        next(err);
    })

})

//delete the post under city
router.post('/posts/delete/:id/:country/:city', (req, res, next)=>{
    let country = req.params.country;
    let city = req.params.city;
    Post.findByIdAndRemove(req.params.id)
    .then(()=>{
        res.redirect('/posts/'+country+'/'+city);
    })
    .catch((err)=>{
        next(err);
    })

})




//see posts under country
router.get('/posts/:country',(req,res,next)=>{
    Post.find({country: req.params.country}).populate('author').populate({path:'comments',populate:{path:'author'}})
    .then((allThePosts)=>{
        console.log(req.params.country);
        if(req.user){

            allThePosts.forEach((eachPost)=>{
                if(eachPost.author._id.equals(req.user._id)){
                    eachPost.owned = true;
                }
                eachPost.comments.forEach((eachComment)=>{
                    if(eachComment.author._id.equals(req.user._id)){
                        eachComment.owned = true;
                    }
                })
            })
            
        }
        let allTheCities = require ('full-countries-cities').getCities(req.params.country);
        res.render('postViews/postsWithCountry',{posts: allThePosts, cities: allTheCities, country:req.params.country})
    })
    .catch((err)=>{
        next(err);
    })
});


//see posts under city
router.get('/posts/:country/:city',(req,res,next)=>{

    Post.find({country: req.params.country, city: req.params.city}).populate('author').populate({path:'comments',populate:{path:'author'}})
    .then((allThePosts)=>{
        if(req.user){

            allThePosts.forEach((eachPost)=>{
                if(eachPost.author._id.equals(req.user._id)){
                    eachPost.owned = true;
                }
                eachPost.comments.forEach((eachComment)=>{
                    if(eachComment.author._id.equals(req.user._id)){
                        eachComment.owned = true;
                    }
                })
            })
        }
        let allTheCountries = require ('full-countries-cities').getCountryNames();
        let allTheCities = require ('full-countries-cities').getCities(req.params.country);
        res.render('postViews/postsWithCity',{
            posts: allThePosts,
            theCountry:req.params.country, 
            theCity:req.params.city, 
            countries:allTheCountries, cities:allTheCities})
    })
    .catch((err)=>{
        next(err);
    })
});






module.exports = router;