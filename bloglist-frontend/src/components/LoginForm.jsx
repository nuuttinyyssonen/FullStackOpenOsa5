import React from 'react'
import PropTypes from 'prop-types'

const LoginForm = ({ username, password, setPassword, setUsername, handleSubmit, user }) => {

  const loginForm = () => (
    <form onSubmit={handleSubmit}>
      <h1>login to application</h1>
      <div>
            username
        <input
          type='text'
          value={username}
          name='username'
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
            password
        <input
          type='password'
          value={password}
          name='password'
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type='submit'>Login</button>
    </form>
  )

  return(
    <div>
      {!user && loginForm()}
    </div>
  )
}

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
}

export default LoginForm