const { StatusCodes } = require('http-status-codes')
const mongoose = require('mongoose')
const User = require('../models/User')
const { BadRequestError, UnauthenticatedError } = require('../errors')
const bcrypt = require('bcryptjs')
require('dotenv').config()
const jwt = require('jsonwebtoken')

const register = async (req, res) => {
  // const {name,email,password} =  req.body
  // const salt = await bcrypt.genSalt(10)  // more the gensalt number, more randome bytes mores secure but more processing time
  // const hashPassword = await bcrypt.hash(password,salt)
  // const tempUser = {name,email,password:hashPassword}
  // ------------ all bcrypt code goes in model - userschema

  // if(!name || !email || !password)  // here we are checking it in controller but we have also checked it in mongoose as well [by require ]
  // {
  //     throw new BadRequestError('Please provide name, email and password')
  // }
  const user = await User.create({ ...req.body })
  //   const token = jwt.sign({ userID: user._id, name: user.name }, 'jwtsecret', {
  //     expiresIn: '30d',
  //   }) // [payload(can be id or name or anything you want to share),secret(),expiresin]
  const token = await user.createJWT() // this function can be only be called by user[the returned instance of model] not User[model]
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token })
}
const login = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    throw new BadRequestError('Please provide email and password')
  }
  // here we have to check email and password in controllers
  //  beacuse it is not checked in mongoose model (we are not creating instance of model so mongoose validation does not work )
  // if we do not check here  then the error will be thrown by findOne
  const user = await User.findOne({ email: email })
  if (!user) {
    throw new UnauthenticatedError('Email is not registerd in application')
  }
  console.log(user);
  const isPasswordCorrect =  await user.comparePassword(password)
  console.log(isPasswordCorrect);
  if(!isPasswordCorrect)
  {
      throw new UnauthenticatedError('Invalid Credentials')
      
    }
    console.log("yaha tak");
  // compare password
  const token = await user.createJWT()
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token })
}

module.exports = { register, login }
