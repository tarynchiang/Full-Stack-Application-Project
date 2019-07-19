const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcryptjs');
const User    = require('../models/User');
const passport = require('passport');



router.get("/signup",(req,res,next)=>{
    res.render('userViews/signup');
});

router.post('/signup',(req,res,next)=>{
    const theName = req.body.theName;
    const theUsername = req.body.theUsername;
    const thePassword = req.body.thePassword;

    const salt = bcrypt.genSaltSync(12);
    const hashedPassWord = bcrypt.hashSync(thePassword,salt);

    User.create({
        username: theUsername,
        password: hashedPassWord,
        name: theName
    })
    .then(()=>{
        console.log('Sign Up Successfully');
        res.redirect('/posts');
    })
    .catch((err)=>{
        next(err);
    })
});



router.get('/login',(req,res,next)=>{
    res.render('userViews/login');
})

router.post("/login", passport.authenticate("local", {
    successRedirect: "/posts",
    failureRedirect:"/",
    failureFlash: true,
    passReqToCallback: true
  }));



router.post('/logout',(req,res,next)=>{
    req.logout();
    res.redirect('/');
})



module.exports = router;