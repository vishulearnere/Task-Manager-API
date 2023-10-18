const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { UnauthenticatedError } = require('../errors')
require('dotenv').config()

const auth = async (req, res, next) => {
  const authHeader  = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthenticatedError('Authentication invalid')
  }
  const token = authHeader.split(' ')[1]
  try {
      const payload = jwt.verify(token, process.env.JWT_SECRET)
      // attach the user to the job routes
      req.user = {userId:payload.userId,name:payload.name}
    //   req.user = User.findById(payload.userId).select('-password')
      next()
  } catch (error) {
    
      throw new UnauthenticatedError('the route is unauthorized')
  }
}

module.exports = auth
