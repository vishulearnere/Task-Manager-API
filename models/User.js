const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    maxLenght: 15,
    trim: true,
    required: [true, 'Please enter the name'],
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please Provide Valid Email',
    ],
    unique: true,
  },
  password: {
    type: String,
    minLength: 6,
    required: [true, 'Please Provide Password'],
  },
})

UserSchema.pre('save', async function (next) {
  // always use function keyword here not arrow function, by doing so you can acess 'this' instance keyboard
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.createJWT = async function () {
  // while giving async keyword to above function it gives error
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  )
}

UserSchema.methods.comparePassword = async function (userPassword) {
  // if async keyword is used here (in mongoose instance) then make sure you use 'await' keyword while calling this function
  const isMatch = await bcrypt.compare(userPassword, this.password)
  return isMatch
}
module.exports = mongoose.model('User', UserSchema)
