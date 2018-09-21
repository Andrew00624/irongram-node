const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commentSchema = new Schema({
  text:String,
  user:{
    type:Schema.Types.ObjectId,
    ref:'User'
  },
  post:{
    type:Schema.Types.ObjectId,
    ref:'Post'
  }
},{
  timestamps:{
    updatedAt:"update_at",
    createdAt:"created_at"
  }
})

module.exports = mongoose.model('Comment', commentSchema)