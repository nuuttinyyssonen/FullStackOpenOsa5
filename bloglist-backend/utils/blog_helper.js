const Blog = require('../models/blog')

const getBlogs = async() => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

module.exports = {
    getBlogs
}