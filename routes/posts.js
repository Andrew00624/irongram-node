const router = require('express').Router()
const Post = require('../models/Post')
const uploadCloud = require('../helpers/cloudinary')


router.get('/', (req, res, next)=>{
  Post.find().sort('-created_at').populate('user')
    .then(posts=>{      
      res.render('posts/newsfeed',{posts})
    }).catch(e=>{
      console.log(e)
      res.redirect('/')
    })
})

router.post('/', uploadCloud.single('image'),(req, res, next)=>{
  req.body['user'] = req.user._id
  if(req.file)req.body['imageURL'] = req.file.url
  Post.create(req.body)
    .then(post=>{
      res.redirect('/posts')
    }).catch(e=>{
      res.redirect('/')
    })
})

router.get('/detail/:id', (req, res, next)=>{
  const {id} = req.params
  Post.findById(id).populate('user')
    .then(post=>{
      let isOwner=false
      if(req.user._id==post.user._id)isOwner=true
      res.render('posts/detail',{post:post, owner:isOwner})
    }).catch('/posts')
})

router.post('/detail/:id',uploadCloud.single('image'),(req, res, next)=>{
  const {id} = req.params
  if(req.file)req.body['imageURL'] = req.file.url
  Post.findByIdAndUpdate(id,{$set:req.body},{new:true})
    .then(post=>{
      res.redirect(`/posts/detail/${post._id}`)
    }).catch(e=>{
      res.redirect('/')
    })
})

router.get('/delete/:id',(req, res, next)=>{
  const {id} = req.params
  Post.findByIdAndRemove(id)
    .then(post=>{
      res.redirect('/posts')
    }).catch(e=>{
      console.log(e)
    })
})

module.exports = router