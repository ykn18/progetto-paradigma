const express = require('express');
const router = express.Router();

const { check } = require('express-validator');

const Tweet = require('../models/tweet');
const autenticationMiddleware = require('../middlewares/auth');
const { checkValidation } = require('../middlewares/validation');

//TO DO: ONLY PARENTLESS (?) TWEETS
router.get('/', function(req, res, next) {
  Tweet.find({parent:{$exists:false}}).populate("_author", "-password").exec(function(err, tweets){
    if (err) return res.status(500).json({error: err});
    res.json(tweets);
  });
});

router.get('/:id', function(req, res, next) {
  Tweet.findOne({_id: req.params.id})
    .populate("_author", "-password")
    .populate({path:"comments", populate : {
      path:"_author", select:"name surname"
    }})
    .exec(function(err, tweet){
      if (err) return res.status(500).json({error: err});
      if(!tweet) return res.status(404).json({message: 'Tweet not found'})
      res.json(tweet);
    });
});

router.post('/',autenticationMiddleware.isAuth, [
  check('tweet').isString().isLength({min: 1, max: 120})
], checkValidation, function(req, res, next) {
  const newTweet = new Tweet(req.body);
  newTweet._author = res.locals.authInfo.userId;
  

  if (req.body.parent){
    Tweet.findOne({_id:req.body.parent})
    .exec(function(err, r){
      if (r) {
        if (r.parent){
          return res.status(400).json({error: err});
        }
        else {
          newTweet.save(function(err, tweet){
            if(err) {
              return res.status(500).json({error: err});
            } 
            Tweet.updateOne({_id:req.body.parent}, {$push:{comments:tweet._id}}).exec(function(err, r){
              res.status(201).json(newTweet);
            })
          });
        }
      }
      else {
        return res.status(400).json({error: err});
      }
    });
  } else {
    newTweet.save(function(err, tweet){
      if(err) {
        return res.status(500).json({error: err});
      } 
      res.status(201).json(newTweet);
    });
  }
  
  
});

router.put('/:id', autenticationMiddleware.isAuth, [
  check('tweet').isString().isLength({min: 1, max: 120})
], checkValidation, function(req, res, next) {
  Tweet.findOne({_id: req.params.id}).exec(function(err, tweet) {
    if (err) {
      return res.status(500).json({
        error: err,
        message: "Error reading the tweet"
      });
    }
    if (!tweet) {
      return res.status(404).json({
        message: "Tweet not found"
      })
    }
    if (tweet._author.toString() !== res.locals.authInfo.userId) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "You are not the owner of the resource"
      });
    }
    tweet.tweet = req.body.tweet;
    tweet.save(function(err) {
      if(err) return res.status(500).json({error: err});
      res.json(tweet);
    });
  });
});

router.delete('/:id', autenticationMiddleware.isAuth, function(req, res, next) {
  Tweet.findOne({_id: req.params.id}).exec(function(err, tweet) {
    if (err) {
      return res.status(500).json({
        error: err,
        message: "Error reading the tweet"
      });
    }
    if (!tweet) {
      return res.status(404).json({
        message: "Tweet not found"
      })
    }
    if (tweet._author.toString() !== res.locals.authInfo.userId) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "You are not the owner of the resource"
      });
    }
    if (tweet.parent) {
      Tweet.updateOne({_id:tweet.parent}, {$pull:{comments:tweet._id}}).exec(function(err){
        if(err) {
          return res.status(500).json({error: err})
        }
        Tweet.remove({_id: req.params.id}, function(err) {
          if(err) {
            return res.status(500).json({error: err})
          }
          res.json({message: 'Tweet successfully deleted'})
        });
      });
    }
    else {
      Tweet.deleteMany({parent:tweet._id}).exec(function(err){
        if(err) {
          return res.status(500).json({error: err})
        }
        Tweet.remove({_id: req.params.id}, function(err) {
          if(err) {
            return res.status(500).json({error: err})
          }
          res.json({message: 'Tweet successfully deleted'})
        });
      });
    }
    
  });
});

module.exports = router;