// import {isAuth, isVip} from '../../middleware/auth.js'
import getProducts from '../controllers/product.js'
import express from 'express'

const productsRoutes = express.Router()

productsRoutes.get('/', getProducts)

export default productsRoutes
