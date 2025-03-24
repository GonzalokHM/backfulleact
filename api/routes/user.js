import { isAuth, isVip } from '../../middlewares/auth.js'
import upload from '../../middlewares/file.js'
import {
  getUsers,
  updateUser,
  updateUserRol,
  deleteUser
} from '../controllers/user.js'
import express from 'express'

const userRoutes = express.Router()

userRoutes.get('/', [isAuth, isVip], getUsers)
userRoutes.put('/', [isAuth], upload.single('avatar'), updateUser)
userRoutes.put('/role/:id', [isAuth], updateUserRol)
userRoutes.delete('/:id', [isAuth], deleteUser)

export default userRoutes
