// import {isAuth, isVip} from '../../middleware/auth.js'
import {
  filterProducts,
  getProductByASIN,
  getProducts,
  getTopSellingPerCategory,
  getUniqueProductPerCategory
} from '../controllers/product'
import express from 'express'

const productsRoutes = express.Router()

productsRoutes.get('/', getProducts)
productsRoutes.get('/filter', filterProducts)
productsRoutes.get('/unique', getUniqueProductPerCategory)
productsRoutes.get('/top', getTopSellingPerCategory)
productsRoutes.get('/asin/:asin', getProductByASIN)

export default productsRoutes
