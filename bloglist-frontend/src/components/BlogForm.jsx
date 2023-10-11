import React from 'react'
import { useState, useEffect } from 'react'
import blogService from '../services/blogs'
import PropTypes from 'prop-types'

const BlogForm = ({handleNewPost, title, author, url, handleAuthorChange, handleTitleChange, handleUrlChange }) => {

  const blogForm = () => (
    <form onSubmit={handleNewPost}>
      <div>
        <h2>Create New</h2>
        <div>
              title:
          <input
            type='text'
            value={title}
            onChange={handleTitleChange}
            placeholder='title'
            id='title'
          />
        </div>
        <div>
              author:
          <input
            type='text'
            value={author}
            onChange={handleAuthorChange}
            placeholder='author'
            id='author'
          />
        </div>
        <div>
              url:
          <input
            type='text'
            value={url}
            onChange={handleUrlChange}
            placeholder='url'
            id='url'
          />
        </div>
      </div>
      <button id='create-btn' type='submit'>Create</button>
    </form>
  )

  return(
    <div>
      {blogForm()}
    </div>
  )

}

BlogForm.propTypes = {
  user: PropTypes.object.isRequired,
  displayMessage: PropTypes.func.isRequired,
  blogs: PropTypes.array.isRequired
}

export default BlogForm