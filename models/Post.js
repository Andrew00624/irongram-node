const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postSchema = new Schema({
  likeado:{
    type:Boolean,
    default:false
  },
  text:String,
  imageURL:String,
  user:{
    type:Schema.Types.ObjectId,
    ref:'User'
  },
  likes:[{
    type:Schema.Types.ObjectId,
    ref:'User'
  }]
}, {
  timestamps:{
    createdAt:"created_at",
    updatedAt:"updated_at"
  }
})

module.exports = mongoose.model('Post', postSchema)