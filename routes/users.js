const router = require('express').Router()
const User = require('../models/User')
const uploadCloud = require('../helpers/cloudinary')
//importar los posts

router.get('/:username', (req, res, next)=>{
  const {username} = req.params
  User.findOne({username:username})
    .then(user=>{
      let isOwner = false
      if(req.user._id==user._id)isOwner=true
      console.log(req.user._id)
      console.log(user._id)
      res.render('users/profile',{data:user,owner:isOwner})
    }).catch(error=>{
      res.redirect('/')
    })
})

//edit user info
router.post('/:username', uploadCloud.single('image'),(req, res, next)=>{
  const {username} = req.params
  if(req.file)req.body['photoURL']=req.file.url
  User.findOneAndUpdate({username:username},{$set:req.body},{new:true})
    .then(user=>{
      res.redirect(`/users/${user.username}`)
    }).catch(e=>{
      console.log(e)
    })
})






module.exports = router