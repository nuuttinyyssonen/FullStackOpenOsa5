import React from 'react'
import { useState, useEffect } from 'react'
import blogService from '../services/blogs'
import PropTypes from 'prop-types'

const BlogForm = ({ user, displayMessage, setSuccessMessage, setBlogs, blogs }) => {

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  const handleNewPost = async(event) => {
    event.preventDefault()
    try {
      const newBlogPost = {
        title: title,
        author: author,
        url: url
      }
      const post = await blogService.create(newBlogPost)
      setAuthor('')
      setTitle('')
      setUrl('')
      setSuccessMessage('a new blog ' + newBlogPost.title + ' by ' + newBlogPost.author + ' added')
      const blogs = await blogService.getAll()
      setBlogs(blogs)
      displayMessage()
    } catch(error) {
      console.error(error)
    }
  }


  const blogForm = () => (
    <form onSubmit={handleNewPost}>
      <div>
        <h2>Create New</h2>
        <div>
              title:
          <input
            type='text'
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
              author:
          <input
            type='text'
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
              url:
          <input
            type='text'
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
      </div>
      <button type='submit'>Create</button>
    </form>
  )

  return(
    <div>
      {user && blogForm()}
    </div>
  )

}

BlogForm.propTypes = {
  user: PropTypes.object.isRequired,
  displayMessage: PropTypes.func.isRequired,
  blogs: PropTypes.array.isRequired
}

export default BlogForm