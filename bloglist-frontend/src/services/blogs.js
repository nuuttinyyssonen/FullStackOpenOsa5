import axios from 'axios'
const baseUrlLogin = 'http://localhost:3003/api/login'
const baseUrlBlog = 'http://localhost:3003/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const login = async(credentials) => {
  const response = await axios.post(baseUrlLogin, credentials, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return response.data
}

const create = async(newBlog) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrlBlog, newBlog, config)
  return response.data
}

const update = async(id, newBlog) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.put(`${baseUrlBlog}/${id}`, newBlog, config)
  return response.data
}

const deleteRecord = async(id) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.delete(`${baseUrlBlog}/${id}`, config)
  return response.data
}

const getAll = async() => {
  const response = await axios.get(baseUrlBlog)
  return response.data
}

export default { getAll, login, setToken, create, update, deleteRecord }