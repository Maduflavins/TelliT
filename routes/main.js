const router = require('express').Router();


router.get('/', (req, res, next)=>{
    res.render('main/landing',);

});


module.exports = router;