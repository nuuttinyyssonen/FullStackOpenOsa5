const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const User = require('../models/user')

const getTokenFrom = (request, response, next) => {
    const authorization = request.get('authorization')
    if(authorization && authorization.startsWith('Bearer ')) {
      request.token = authorization.replace('Bearer ', "")
    } else {
        request.token = null
    }
    next()
}

const userExtractor = async (request, response, next) => {
  const token = request.token
  if(!token) {
    request.user = null
    return next()
  }
  try {
    const decodedToken = jwt.verify(token, config.SECRET)
    const user = await User.findById(decodedToken.id);
    if(user) {
      request.user = user
    } else {
      request.user = null
    }
  } catch(error) {
    console.error('Error in userExtractor middleware: '. error)
    request.user = null
  }
  next()
}

module.exports = {
  getTokenFrom,
  userExtractor
}