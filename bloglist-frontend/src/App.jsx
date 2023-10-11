import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import BlogForm from './components/blogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if(loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
  }

  const handleLogin = async(event) => {
    event.preventDefault()
    try {
      const user = await blogService.login({
        username, password
      })
      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch(error) {
      console.error(error)
      setErrorMessage('Invalid username or password')
      displayMessage()
    }
  }

  const displayMessage = () => {
    setTimeout(() => {
      setErrorMessage('')
      setSuccessMessage('')
    }, 5000)
  }

  const handleLike = async(author, likes, title, url, id) => {
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


  const blogsMap = () => {
    const sortedBlogs = blogs.sort((first, second) => second.likes - first.likes)
    return sortedBlogs.map(blog => (
      <Blog 
        key={blog.id} 
        blog={blog} 
        setBlogs={setBlogs} 
        displayMessage={displayMessage} 
        setErrorMessage={setErrorMessage} 
        user={user} 
        handleLike={() => handleLike(blog.author, blog.likes, blog.title, blog.url, blog.id)}
        />
    ))
  }

  const handleNewPost = async(event) => {
    event.preventDefault()
    console.log("fired")
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

  return (
    <div>
      <p>{errorMessage}</p>
      <LoginForm
        username={username}
        password={password}
        setPassword={setPassword}
        setUsername={setUsername}
        handleSubmit={handleLogin}
        user={user}
      />

      {user && <div>
        <p>{user.name} logged in</p>
        <button id='logout-btn' onClick={handleLogout}>Logout</button>
        <p>{successMessage}</p>
      </div>}

      {user && <Togglable buttonLabel='create new blog'>
        <BlogForm
          user={user}
          displayMessage={displayMessage}
          setSuccessMessage={setSuccessMessage}
          setBlogs={setBlogs}
          blogs={blogs}
          handleNewPost={handleNewPost}
          title={title}
          author={author}
          url={url}
          handleAuthorChange={(event) => setAuthor(event.target.value)}
          handleTitleChange={(event) => setTitle(event.target.value)}
          handleUrlChange={(event) => setUrl(event.target.value)}
        />
      </Togglable>}

      <div>
        {user && <div>
          <h2>Blogs</h2>
          {blogsMap()}
        </div>}
      </div>

    </div>
  )
}

export default App