const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const postSchema = new Schema ({
    title: String,
    content: String,
    author: {type: Schema.Types.ObjectId, ref: 'User'},
    country:String,
    region:String,
    city:String,
    likes:[{ type : Schema.Types.ObjectId, ref: 'User' }],
    img: String,
    comments:[{ type : Schema.Types.ObjectId, ref: 'Comment' }]
})


const Post = mongoose.model('Post', postSchema);



module.exports = Post;