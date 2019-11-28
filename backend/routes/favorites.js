const express = require('express');
const router = express.Router();

const { check } = require('express-validator');

const User = require('../models/user');
const autenticationMiddleware = require('../middlewares/auth');
const { checkValidation } = require('../middlewares/validation');

router.get('/', autenticationMiddleware.isAuth, function(req, res, next) {
  User.find({_id:res.locals.authInfo.userId}, "-password").populate({path:"favorites", populate : {
    path:"_author", select:"name surname"
  }})
  .exec(function(err, users){
    if (err) return res.status(500).json({error: err});
    return res.json(users[0].favorites);
  });
});


router.post('/:id', autenticationMiddleware.isAuth, function(req, res, next) {
  User.findOneAndUpdate({_id:res.locals.authInfo.userId}, {$addToSet:{favorites:req.params.id}})
  .exec(function(err, r){
    if(err) {
        return res.status(500).json({error:err})
      }
      return res.status(200).json({msg:"done"});
    });
});


router.delete('/:id', autenticationMiddleware.isAuth, function(req, res, next) {
  User.updateOne({_id:res.locals.authInfo.userId}, {$pull:{favorites:req.params.id}}).exec(function(err, r){
    res.status(201).json({"msg":"done"});
  })
  
});

module.exports = router;