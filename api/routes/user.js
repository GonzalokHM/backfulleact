import { isAuth, isVip } from '../../middlewares/auth'
import {
  getUsers,
  updateUser,
  updateUserRol,
  deleteUser
} from '../controllers/user'
import express from 'express'

const userRoutes = express.Router()

userRoutes.get('/', [isAuth, isVip], getUsers)
userRoutes.put('/', [isAuth], updateUser)
userRoutes.put('/role/:id', [isAuth], updateUserRol)
userRoutes.delete('/:id', [isAuth], deleteUser)

export default userRoutes
