import {
  getUsers,
  updateUser,
  updateUserRol,
  deleteUser
} from '../controllers/user'
import express from 'express'

const userRoutes = express.Router()

userRoutes.get('/', getUsers)
userRoutes.put('/', updateUser)
userRoutes.put('/role/:id', updateUserRol)
userRoutes.delete('/:id', deleteUser)

export default userRoutes
