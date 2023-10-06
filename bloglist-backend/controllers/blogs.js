const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user')
  response.json(blogs)
})


blogsRouter.post('/', async (request, response) => {
    const body = request.body
    const decodedToken = jwt.verify(request.token, config.SECRET)
    if(!decodedToken.id) {
      return response.status(400).json({ error: 'token invalid' })
    }
    const user = request.user

    if(!body.title || !body.url) {
      return response.status(400).json({ error: 'title and url are required' });
    }

    const newBlog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user._id
    })

    const savedBlog = await newBlog.save()
    user.blog = user.blog.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
})


blogsRouter.delete('/:id', async(request, response) => {
  if(!request.token) {
    return response.status(401).json({ error: "Token is missing" })
  }
  const decodedToken = jwt.verify(request.token, config.SECRET)
  if(!decodedToken.id) {
    return response.status(400).json({ error: 'token invalid' })
  }
  const user = request.user
  const blog = await Blog.findById(request.params.id)
  if(user._id.toString() === blog.user._id.toString()) {
    try {
      const result = await Blog.findByIdAndRemove(request.params.id)
      if(result) {
        response.status(204).end()
      } else {
        response.status(404).end();
      }
  } catch(error) {
    console.error(error)
    response.status(500).json({ error: "Internal Server Error"})
  }
  } else {
    response.status(400).json({ error: "User is not authorized to delete this blog" })
  }
})


blogsRouter.put('/:id', async (request, response) => {
    const body = request.body
    const blog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0
    }
    
    try {
      const result = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
      if(result) {
        response.status(204).end()
      } else {
        response.status(404).end()
      }
    } catch(error) {
      console.error(error)
    }
})

module.exports = blogsRouter