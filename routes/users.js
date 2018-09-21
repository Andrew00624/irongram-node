const router = require('express').Router()
const User = require('../models/User')
//importar los posts

router.get('/:username', (req, res, next)=>{
  const {username} = req.params
  User.findOne({username:username})
    .then(user=>{
      let isOwner = false
      if(req.user._id==user._id)isOwner=true
      console.log(req.user._id)
      console.log(user._id)
      res.render('users/profile',{user,owner:isOwner})
    }).catch(error=>{
      res.redirect('/')
    })
})

//edit user info



module.exports = router