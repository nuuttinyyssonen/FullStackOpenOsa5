import React, { useEffect } from 'react'
import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, setBlogs, setErrorMessage, displayMessage, user, handleLike}) => {

  const [isShown, setIsShown] = useState(false)
  const [button, setButton] = useState("Show")

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

  const toggleVisibility = () => {
    if(isShown) {
      setIsShown(false)
      setButton("Show")
    } else {
      setIsShown(true)
      setButton("Hide")
    }
  }

  return (
    <div>
        <p>{blog.title} <button onClick={toggleVisibility}>{button}</button></p>
        {isShown && <div>
          <p>{blog.url}</p>
          <p data-testid="likes">{blog.likes} <button onClick={handleLike}>like</button></p>
          <p>{blog.author}</p>
          {user && blog.user.username === user.username && <button onClick={() => handleDelete(blog.id, blog.title, blog.author)}>Remove</button>}
        </div>}
    </div>
  )
}

export default Blog