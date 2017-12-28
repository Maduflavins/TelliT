const router = require('express').Router();
const User = require('../models/user');
const Tell   = require('../models/tell');


router.get('/', (req, res, next)=>{
    if(req.user){
        Tell.find({})
            .sort('-created')
            .populate('owner')
            .exec(function(err, tells){
                if(err) return next(err);
                console.log(tells);
                res.render('main/home', { tells: tells});

            })
       
    }else{
        res.render('main/landing');
    }
   

});

router.get('/user/:id', (req, res, next) =>{
    async.waterfall([
        function(callback){
            Tell.find({ owner: req.params.id })
                .populate('owner')
                .exec(function(err, tells){
                    callback(err, tells)
                });

        },
        function(tells, callback){
            User.findOne({ _id: req.params.id })
                .populate('admiring')
                .populate('admirers')
                .exec(function(err, user){
                    res.render('main/user', { foundUser: user, tells: tells });
                })

        }
    ])
})


module.exports = router;