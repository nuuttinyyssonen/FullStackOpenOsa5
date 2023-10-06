import React, { useEffect } from 'react'
import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, setBlogs, setErrorMessage, displayMessage, user }) => {

  const [visible, setvisible] = useState(false)
  const [button, setButton] = useState('Show')

  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setvisible(!visible)
    if(visible) {
      setButton('Show')
    } else {
      setButton('Hide')
    }
  }

  const handleLike = async(author, likes, title, url, id) => {
    console.log(blog)
    const newLikes = likes + 1
    const newObject = {
      title: title,
      author: author,
      url: url,
      likes: newLikes
    }
    try {
      const updatedPost = await blogService.update(id, newObject)
      const blogs = await blogService.getAll()
      setBlogs(blogs)
    } catch(error) {
      console.error(error)
    }
  }

  const handleDelete = async(id, title, author) => {
    if(window.confirm('Remove blog ' + title + ' by ' + author)) {
      try {
        const deletedRecord = await blogService.deleteRecord(id)
        const blogs = await blogService.getAll()
        setBlogs(blogs)
      } catch(error) {
        setErrorMessage(error.response.data.error)
        displayMessage()
      }
    }
  }

  return (
    <div>
      <div>
        {blog.title} <button onClick={toggleVisibility}>{button}</button>
      </div>
      <div style={showWhenVisible}>
        <p>{blog.url}</p>
        <p>{blog.likes} <button onClick={() => handleLike(blog.author, blog.likes, blog.title, blog.url, blog.id)}>like</button></p>
        <p>{blog.author}</p>
        {blog.user.username === user.username && <button onClick={() => handleDelete(blog.id, blog.title, blog.author)}>Remove</button>}
      </div>
    </div>
  )
}

export default Blog