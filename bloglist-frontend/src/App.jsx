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

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if(loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
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

  const blogsMap = () => {
    const sortedBlogs = blogs.sort((first, second) => second.likes - first.likes)
    return sortedBlogs.map(blog => (
      <Blog key={blog.id} blog={blog} setBlogs={setBlogs} displayMessage={displayMessage} setErrorMessage={setErrorMessage} user={user}/>
    ))
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
        <button onClick={handleLogout}>Logout</button>
        <p>{successMessage}</p>
      </div>}

      {user && <Togglable buttonLabel='create new blog'>
        <BlogForm
          user={user}
          displayMessage={displayMessage}
          setSuccessMessage={setSuccessMessage}
          setBlogs={setBlogs}
          blogs={blogs}
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