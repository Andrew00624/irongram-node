const router = require('express').Router()
const User = require('../models/User')
const passport = require('../helpers/passport')
const welcomeMail = require('../helpers/mailer').welcomeMail



//signup
router.get('/signup',(req, res, next)=>{
  res.render('auth/signup')
})

router.post('/signup',(req, res, next)=>{
  const {username, email} = req.body
  User.register(req.body, req.body.password)
    .then(user=>{
      welcomeMail(username, email)
      res.redirect('/login')
    }).catch(error=>{
      res.render('auth/signup',{data:req.body,error})
    })
})

//login

router.get('/login', (req, res, next)=>{
  res.render('auth/login')
})

router.post('/login', passport.authenticate('local'), (req, res, next)=>{
  const {username} = req.user
  res.redirect(`/users/${username}`)
})


module.exports = router