const router = require('express').Router()
const Post = require('../models/Post')
const uploadCloud = require('../helpers/cloudinary')
const Comment = require('../models/Comment')
const ObjectId = require('mongodb').ObjectID;


//lista de posts
router.get('/', (req, res, next)=>{
  Post.find().sort('-created_at').populate('user')
    .then(posts=>{
      
      const postitos = posts.map(p=>{
        p = Object.assign({},p)      
        p._doc.like=false
        const uID = ObjectId(req.user._id)

        //if(p._doc.likes.includes(uID))p._doc.like=true
        p._doc.likes.map(l=>{
          l = ObjectId.toString(l)

          console.log(l==req.user._id)
          console.log(l)
          console.log(req.user._id)
          if(l==req.user._id)p._doc.like=true
        })
        
        return p
      })   
      console.log(postitos)
      res.render('posts/newsfeed',{postitos})
    }).catch(e=>{
      console.log(e)
      //res.redirect('/')
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


//detalle del post
router.get('/detail/:id', (req, res, next)=>{
  const {id} = req.params
  Post.findById(id).populate('user')
    .then(post=>{
      Comment.find({post:post._id}).populate('user')
        .then(comments=>{
          let isOwner=false
          if(req.user._id==post.user._id)isOwner=true
          res.render('posts/detail',{post:post, owner:isOwner,comments:comments})
        }).catch(e=>{
          console.log(e)
        })
      
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

router.post('/detail/:id/comments',(req, res, next)=>{
  const {id} = req.params
  req.body['post'] = id
  req.body['user'] = req.user._id
  Comment.create(req.body)
    .then(comment=>{
      res.redirect(`/posts/detail/${id}`)
    }).catch(e=>{
      console.log(e)
    })
})


//borramos el post
router.get('/delete/:id',(req, res, next)=>{
  const {id} = req.params
  Post.findByIdAndRemove(id)
    .then(post=>{
      res.redirect('/posts')
    }).catch(e=>{
      console.log(e)
    })
})

///like-dislike post

router.get('/like/:id',(req, res, next)=>{
  const {id} = req.params
  Post.findOne({_id:id,likes:{$in:[req.user._id]}})
    .then(post=>{
      if(post==null){
        Post.findByIdAndUpdate(id,{$push:{likes:req.user._id}})
          .then(p=>{
            res.redirect('/posts')
          }).catch(e=>{
            console.log(e)
          })
      }else{
        Post.findByIdAndUpdate(id,{$pull:{likes:req.user._id}})
          .then(p=>{
            res.redirect('/posts')
          }).catch(e=>{
            console.log(e)
          })
      }
    }).catch(e=>{
      console.log(e)
    })
})

module.exports = router