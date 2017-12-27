const router = require('express').Router();
const User   = require('../models/user');


router.get('/', (req, res, next)=>{
    if(req.user){
        res.render('main/home');
    }else{
        res.render('main/landing');
    }
   

});

router.get('/create-new-user', (req, res, next)=>{
    var user = new User();
    user.email = "blajdfburbf@gmail.com";
    user.name = "jack";
    user.password = "jack";
    user.save(function(err){
        if(err) return next(err);
        res.json("success, created")
    })
})


module.exports = router;