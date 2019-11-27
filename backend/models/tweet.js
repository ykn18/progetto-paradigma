const mongoose = require('mongoose');

const tweetSchema = mongoose.Schema({
    _author: {type: mongoose.Schema.Types.ObjectId, required: true, index: true, ref: 'User'},
    tweet: {type: String, minlenght: 1, maxlenght: 280},
    created_at: {type: Date, default: Date.now()},
    
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }],
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    hashtags: [{type: String, minlenght: 1, maxlenght:100}],
});

const Tweet = mongoose.model('Tweet', tweetSchema);

module.exports = Tweet;