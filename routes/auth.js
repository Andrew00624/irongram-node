const router = require('express').Router()
const User = require('../models/User')
const passport = require('../helpers/passport')



//signup
router.get('/signup',(req, res, next)=>{
  res.render('auth/signup')
})

router.post('/signup',(req, res, next)=>{
  User.register(req.body, req.body.password)
    .then(user=>{
      res.redirect('/login')
    }).catch(error=>{
      res.render('auth/signup',{data:req.body,error})
    })
})


module.exports = router