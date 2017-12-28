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
                    var admirer = user.admirers.some(function(friend){
                        return friend.equals(req.user._id);
                    })

                    var currentUser;
                    if(req.user._id.equals(user._id)){
                        currentUser = false;
                    }
                    res.render('main/user', { foundUser: user, tells: tells, currentUser: currentUser, admirer: admirer });
                })

        }
    ])
});

router.post('/admire/:id', (req, res, next)=>{
    async.parallel([
        function(callback){
            User.update(
                {
                    _id: req.user._id,
                    admiring: { $ne: req.params.id }
                },
                {
                    $push:{ admiring: req.params.id }
                }, function(err, count){
                    callback(err, count);
                }
            )

        },

        function(callback){
            User.update(
                {
                    _id: req.params.id,
                    admirers: { $ne: req.user._id }
                },
                {
                    $push:{ admirers: req.params.id }
                }, function(err, count){
                    callback(err, count);
                }
            )

        }
    ], function(err, results) {
        if(err) return next(err);
        res.json("Success");
    })
})


router.post('/unadmire/:id', (req, res, next)=>{
    async.parallel([
        function(callback){
            User.update(
                {
                    _id: req.user._id
                    
                },
                {
                    $pull:{ admiring: req.params.id }
                }, function(err, count){
                    callback(err, count);
                }
            )

        },

        function(callback){
            User.update(
                {
                    _id: req.params.id
                },
                {
                    $pull:{ admirers: req.params.id }
                }, function(err, count){
                    callback(err, count);
                }
            )

        }
    ], function(err, results) {
        if(err) return next(err);
        res.json("Success");
    })
})


module.exports = router;