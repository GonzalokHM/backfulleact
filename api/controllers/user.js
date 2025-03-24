import User from '../models/User.js'
import setError from '../../config/error.js'
import uploadToCloudinary from '../../utils/UpFile.js'
import deleteFile from '../../utils/deleteFile.js'

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find()
    return res.status(200).json(users)
  } catch (error) {
    return next(setError(400, 'no users found'))
  }
}
const updateUser = async (req, res, next) => {
  try {
    const userId = req.user._id
    const oldUser = await User.findById(userId)

    if (!oldUser) {
      return next(setError(404, 'User not found'))
    }

    const newUser = {
      ...oldUser.toObject(),
      ...req.body
    }

    if (req.file) {
      newUser.avatar = req.file.path
      if (oldUser.avatar) {
        deleteFile(oldUser.avatar)
      }
    }

    const userUpdated = await User.findByIdAndUpdate(userId, newUser, {
      new: true,
      runValidators: true
    })
    return res.status(200).json(userUpdated)
  } catch (error) {
    return next(setError(400, "can't update Users 😱"))
  }
}

const updateUserRol = async (req, res, next) => {
  try {
    const { id } = req.params
    const { newRole } = req.body

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { vip: newRole },
      { new: true }
    )

    if (!updatedUser) {
      return next(setError(404, 'User not found'))
    }

    return res.status(200).json(updatedUser)
  } catch (error) {
    return next(setError(500, 'Error updating user role'))
  }
}

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params
    const deleteUser = await User.findByIdAndDelete(id)
    return res.status(200).json(deleteUser)
  } catch (error) {
    return next(setError(400, "can't delete Users 😱"))
  }
}

export { getUsers, updateUser, updateUserRol, deleteUser }
