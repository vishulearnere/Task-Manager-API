const { BadRequestError, NotFoundError } = require('../errors')
const notFound = require('../middleware/not-found')
const Task = require('../models/Task')
const { StatusCodes } = require('http-status-codes')

const getAllTasks = async (req, res) => {
  const tasks = await Task.find({ createdBy: req.user.userId }).sort('createdAt')
  res.status(StatusCodes.OK).json({ tasks, count: tasks.length })
}
const createTask = async (req, res) => {
  req.body.createdBy = req.user.userId
  const task = await Task.create(req.body)
  console.log(req.body)
  res.status(StatusCodes.CREATED).json({ task })
}
const getTask = async (req, res) => {
  // const {taskId} = req.params
  // createdBy = req.user.userId
  const {
    user: { userId },
    params: { id: taskId },
  } = req
  //    | from user get userId,from params get id and give alias name as _id
  const task = await Task.findOne({
    _id: taskId,
    createdBy: userId,
  })
  if (!task) {
    throw new NotFoundError(`No Task with id ${taskId}`)
  }

  res.status(StatusCodes.OK).json({ task })
}
const updateTask = async (req, res) => {
  const {
    user: { userId },
    params: { id: taskId },
    body: { title, description, dueDate },
  } = req
  if (title === ' ' || description === ' ' || dueDate === ' ') {
    throw new BadRequestError('title, description and dueDate fields can not be empty')
  }
  const task = await Task.findOneAndUpdate(
    { _id: taskId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  )
  if (!task) {
    throw new NotFoundError(`No Task with id ${taskId}`)
  }
  res.status(StatusCodes.OK).json({ task })
}
const deleteTask = async (req, res) => {
  const {
    user: { userId },
    params: { id: taskId },
  } = req
  const task = await Task.findOneAndDelete({ _id: taskId, createdBy: userId })
  if (!task) {
    throw new NotFoundError(`No task Exists with id ${taskId}`)
  }
  // console.log(req.params,task)

  res.status(StatusCodes.OK).json()
}

module.exports = { getAllTasks, getTask, createTask, updateTask, deleteTask }
