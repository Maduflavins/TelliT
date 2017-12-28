const async = require('async');
const Tell  = require('../models/tell');
const User  = require('../models/user');
module.exports = function(io){

    io.on('connection', function(socket){
        console.log("connected");
        var user = socket.request.user;
        console.log(user.name);

        socket.on('tweet', (data)=>{
            console.log(data);
            async.parallel([
                function(callback){
                    io.emit('incomingTweets', { data, user});
                },

                function(callback){
                    async.waterfall([
                        function(callback){
                            var tell = new Tell();
                            tell.content = data.content;
                            tell.owner   = user._id;
                            tell.save(function(err){
                                callback(err, tell);
                            })
                        },

                        function(tell, callback){
                            User.update(
                                {
                                    _id: user._id
                                },
                                {
                                    $push: { tells: { tell: tell._id }}
                                }, function(err, count){
                                    callback(err, count);
                                }
                            )
                        }
                    ])
                }
            ])
        })
    })
}